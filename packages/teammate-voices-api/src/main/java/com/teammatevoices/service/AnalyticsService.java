package com.teammatevoices.service;

import com.teammatevoices.dto.SurveyAnalyticsDTO;
import com.teammatevoices.dto.SurveyAnalyticsDTO.*;
import com.teammatevoices.exception.ResourceNotFoundException;
import com.teammatevoices.model.Survey;
import com.teammatevoices.model.SurveyAnswer;
import com.teammatevoices.model.SurveyResponse;
import com.teammatevoices.model.SurveyQuestion;
import com.teammatevoices.repository.DispatchRepository;
import com.teammatevoices.repository.SurveyAnswerRepository;
import com.teammatevoices.repository.SurveyQuestionRepository;
import com.teammatevoices.repository.SurveyResponseRepository;
import com.teammatevoices.repository.SurveyRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsService.class);

    private final SurveyRepository surveyRepository;
    private final SurveyResponseRepository responseRepository;
    private final SurveyAnswerRepository answerRepository;
    private final SurveyQuestionRepository questionRepository;
    private final DispatchRepository dispatchRepository;
    private final ObjectMapper objectMapper;

    public AnalyticsService(SurveyRepository surveyRepository,
                            SurveyResponseRepository responseRepository,
                            SurveyAnswerRepository answerRepository,
                            SurveyQuestionRepository questionRepository,
                            DispatchRepository dispatchRepository,
                            ObjectMapper objectMapper) {
        this.surveyRepository = surveyRepository;
        this.responseRepository = responseRepository;
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.dispatchRepository = dispatchRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public SurveyAnalyticsDTO getAnalytics(Long surveyId) {
        return getAnalytics(surveyId, null);
    }

    /**
     * Compute analytics with optional demographic filters.
     * Filters: key = questionId (as string), value = answer text to match.
     * Only responses where ALL filter conditions match are included.
     */
    @Transactional(readOnly = true)
    public SurveyAnalyticsDTO getAnalytics(Long surveyId, Map<String, String> filters) {
        log.info("Computing analytics for survey {} with filters: {}", surveyId, filters);

        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new ResourceNotFoundException("Survey", surveyId));

        List<SurveyResponse> responses = responseRepository.findBySurvey_SurveyId(surveyId);
        List<SurveyAnswer> allAnswers = answerRepository.findByResponse_Survey_SurveyId(surveyId);
        long dispatched = dispatchRepository.findBySurveyId(surveyId).size();

        // Apply demographic filters if present
        if (filters != null && !filters.isEmpty()) {
            // Find response IDs that match ALL filters
            Set<Long> matchingResponseIds = responses.stream()
                    .map(r -> r.getResponseId())
                    .collect(Collectors.toSet());

            for (Map.Entry<String, String> filter : filters.entrySet()) {
                Long filterQuestionId;
                try { filterQuestionId = Long.parseLong(filter.getKey()); }
                catch (NumberFormatException e) { continue; }

                String filterValue = filter.getValue();
                Set<Long> idsWithMatch = allAnswers.stream()
                        .filter(a -> a.getQuestionId().equals(filterQuestionId)
                                && filterValue.equalsIgnoreCase(a.getAnswerText()))
                        .map(a -> a.getResponse().getResponseId())
                        .collect(Collectors.toSet());

                matchingResponseIds.retainAll(idsWithMatch);
            }

            // Filter responses and answers to only matching
            Set<Long> finalIds = matchingResponseIds;
            responses = responses.stream()
                    .filter(r -> finalIds.contains(r.getResponseId()))
                    .collect(Collectors.toList());
            allAnswers = allAnswers.stream()
                    .filter(a -> finalIds.contains(a.getResponse().getResponseId()))
                    .collect(Collectors.toList());

            log.info("Demographic filter applied: {} of {} responses match", responses.size(), dispatched);
        }

        // Build question metadata from BOTH the DB table and pages JSON
        Map<Long, QuestionMeta> questionMetaMap = buildQuestionMetaMap(survey.getPages());

        // Also load from SURVEY_QUESTIONS table (authoritative for DB question IDs)
        List<SurveyQuestion> dbQuestions = questionRepository.findBySurvey_SurveyIdOrderBySortOrder(surveyId);
        enrichMetaFromDbQuestions(questionMetaMap, dbQuestions, survey.getPages());

        SurveyAnalyticsDTO dto = new SurveyAnalyticsDTO();

        // Top-level metrics
        long completed = responses.stream().filter(r -> Boolean.TRUE.equals(r.getIsComplete())).count();
        dto.setTotalResponses(responses.size());
        dto.setCompletedResponses(completed);
        dto.setTotalDispatched(dispatched > 0 ? dispatched : responses.size());

        // Average score (rating scale answers only, values 1-5)
        List<SurveyAnswer> ratingAnswers = allAnswers.stream()
                .filter(a -> a.getAnswerValue() != null && a.getAnswerValue() >= 1 && a.getAnswerValue() <= 5)
                .collect(Collectors.toList());
        double avgScore = ratingAnswers.isEmpty() ? 0.0
                : ratingAnswers.stream().mapToInt(SurveyAnswer::getAnswerValue).average().orElse(0.0);
        dto.setAverageScore(Math.round(avgScore * 10.0) / 10.0);

        // eNPS: find "recommend" question, map 5=Promoter, 4=Passive, 1-3=Detractor
        dto.setEnps(computeENPS(allAnswers, questionMetaMap));

        // Response timeline
        dto.setResponseTimeline(buildTimeline(responses));

        // Score distribution (1-5)
        dto.setScoreDistribution(buildScoreDistribution(ratingAnswers));

        // Category scores (by page)
        dto.setCategoryScores(buildCategoryScores(allAnswers, questionMetaMap));

        // Question rankings
        dto.setQuestionRankings(buildQuestionRankings(allAnswers, questionMetaMap));

        // Demographic breakdown (first page questions — typically demographics)
        dto.setDemographicBreakdown(buildDemographicBreakdown(allAnswers, questionMetaMap));

        // Open-ended responses
        dto.setOpenEndedResponses(buildOpenEnded(allAnswers, questionMetaMap));

        log.info("Analytics computed for survey {}: {} responses, {} answers", surveyId, responses.size(), allAnswers.size());
        return dto;
    }

    private double computeENPS(List<SurveyAnswer> answers, Map<Long, QuestionMeta> metaMap) {
        // Find the "recommend" question by text match
        Long recommendQId = null;
        for (Map.Entry<Long, QuestionMeta> entry : metaMap.entrySet()) {
            if (entry.getValue().text != null
                    && entry.getValue().text.toLowerCase().contains("recommend")) {
                recommendQId = entry.getKey();
                break;
            }
        }
        if (recommendQId == null) return 0.0;

        Long qId = recommendQId;
        List<SurveyAnswer> npsAnswers = answers.stream()
                .filter(a -> a.getQuestionId().equals(qId) && a.getAnswerValue() != null)
                .collect(Collectors.toList());

        if (npsAnswers.isEmpty()) return 0.0;

        // On 1-5 scale: 5 = Promoter, 4 = Passive, 1-3 = Detractor
        long promoters = npsAnswers.stream().filter(a -> a.getAnswerValue() == 5).count();
        long detractors = npsAnswers.stream().filter(a -> a.getAnswerValue() <= 3).count();
        double total = npsAnswers.size();

        return Math.round(((promoters - detractors) / total) * 100.0);
    }

    private List<TimelinePoint> buildTimeline(List<SurveyResponse> responses) {
        Map<LocalDate, Integer> dailyCounts = new TreeMap<>();
        for (SurveyResponse r : responses) {
            if (r.getSubmittedAt() != null) {
                LocalDate date = r.getSubmittedAt().toLocalDate();
                dailyCounts.merge(date, 1, Integer::sum);
            }
        }

        List<TimelinePoint> timeline = new ArrayList<>();
        int cumulative = 0;
        for (Map.Entry<LocalDate, Integer> entry : dailyCounts.entrySet()) {
            cumulative += entry.getValue();
            timeline.add(new TimelinePoint(entry.getKey().toString(), entry.getValue(), cumulative));
        }
        return timeline;
    }

    private List<ScoreDistributionItem> buildScoreDistribution(List<SurveyAnswer> ratingAnswers) {
        Map<Integer, Long> dist = ratingAnswers.stream()
                .collect(Collectors.groupingBy(SurveyAnswer::getAnswerValue, Collectors.counting()));
        List<ScoreDistributionItem> items = new ArrayList<>();
        for (int score = 1; score <= 5; score++) {
            items.add(new ScoreDistributionItem(score, dist.getOrDefault(score, 0L)));
        }
        return items;
    }

    private List<CategoryScoreItem> buildCategoryScores(List<SurveyAnswer> answers,
                                                         Map<Long, QuestionMeta> metaMap) {
        // Group rating answers by page label
        Map<String, List<Integer>> pageScores = new LinkedHashMap<>();
        Map<String, Set<Long>> pageQuestions = new LinkedHashMap<>();

        for (SurveyAnswer a : answers) {
            if (a.getAnswerValue() == null || a.getAnswerValue() < 1 || a.getAnswerValue() > 5) continue;
            QuestionMeta meta = metaMap.get(a.getQuestionId());
            String pageLabel = (meta != null && meta.pageLabel != null) ? meta.pageLabel
                    : (a.getPageId() != null ? a.getPageId() : "Unknown");

            pageScores.computeIfAbsent(pageLabel, k -> new ArrayList<>()).add(a.getAnswerValue());
            pageQuestions.computeIfAbsent(pageLabel, k -> new HashSet<>()).add(a.getQuestionId());
        }

        return pageScores.entrySet().stream()
                .map(e -> {
                    double avg = e.getValue().stream().mapToInt(i -> i).average().orElse(0);
                    int qCount = pageQuestions.getOrDefault(e.getKey(), Set.of()).size();
                    return new CategoryScoreItem(e.getKey(), Math.round(avg * 10.0) / 10.0, qCount);
                })
                .sorted((a, b) -> Double.compare(b.getAvgScore(), a.getAvgScore()))
                .collect(Collectors.toList());
    }

    private List<QuestionRankingItem> buildQuestionRankings(List<SurveyAnswer> answers,
                                                             Map<Long, QuestionMeta> metaMap) {
        // Group rating answers by question
        Map<Long, List<Integer>> questionScores = new LinkedHashMap<>();
        for (SurveyAnswer a : answers) {
            if (a.getAnswerValue() == null || a.getAnswerValue() < 1 || a.getAnswerValue() > 5) continue;
            questionScores.computeIfAbsent(a.getQuestionId(), k -> new ArrayList<>())
                    .add(a.getAnswerValue());
        }

        return questionScores.entrySet().stream()
                .map(e -> {
                    QuestionRankingItem item = new QuestionRankingItem();
                    item.setQuestionId(e.getKey());
                    item.setResponseCount(e.getValue().size());
                    double avg = e.getValue().stream().mapToInt(i -> i).average().orElse(0);
                    item.setAvgScore(Math.round(avg * 100.0) / 100.0);

                    QuestionMeta meta = metaMap.get(e.getKey());
                    item.setQuestionText(meta != null ? meta.text : "Question " + e.getKey());
                    item.setPageLabel(meta != null ? meta.pageLabel : "Unknown");
                    return item;
                })
                .sorted((a, b) -> Double.compare(b.getAvgScore(), a.getAvgScore()))
                .collect(Collectors.toList());
    }

    private List<DemographicItem> buildDemographicBreakdown(List<SurveyAnswer> answers,
                                                             Map<Long, QuestionMeta> metaMap) {
        // Demographics are typically on the first page — look for non-rating questions
        // with answer_value null (select/radio questions store text in answer_text)
        List<DemographicItem> items = new ArrayList<>();

        // Find demographic questions (pageIndex 0 or questions with select/radio types)
        Set<Long> demoQuestionIds = new HashSet<>();
        for (Map.Entry<Long, QuestionMeta> entry : metaMap.entrySet()) {
            QuestionMeta meta = entry.getValue();
            if (meta.pageIndex == 0 && meta.type != null
                    && (meta.type.contains("Select") || meta.type.contains("Radio"))) {
                demoQuestionIds.add(entry.getKey());
            }
        }

        for (Long qId : demoQuestionIds) {
            QuestionMeta meta = metaMap.get(qId);
            String field = meta != null ? meta.text : "Question " + qId;

            Map<String, Long> valueCounts = answers.stream()
                    .filter(a -> a.getQuestionId().equals(qId) && a.getAnswerText() != null && !a.getAnswerText().isBlank())
                    .collect(Collectors.groupingBy(SurveyAnswer::getAnswerText, Collectors.counting()));

            for (Map.Entry<String, Long> vc : valueCounts.entrySet()) {
                items.add(new DemographicItem(qId, field, vc.getKey(), vc.getValue()));
            }
        }

        return items;
    }

    private List<OpenEndedItem> buildOpenEnded(List<SurveyAnswer> answers,
                                               Map<Long, QuestionMeta> metaMap) {
        // Open-ended = answers with answerText but no answerValue (not rating scale)
        Map<Long, List<String>> grouped = new LinkedHashMap<>();
        for (SurveyAnswer a : answers) {
            if (a.getAnswerValue() != null) continue; // Skip rating answers
            if (a.getAnswerText() == null || a.getAnswerText().isBlank()) continue;
            // Also skip demographic select questions
            QuestionMeta meta = metaMap.get(a.getQuestionId());
            if (meta != null && meta.type != null
                    && (meta.type.contains("Select") || meta.type.contains("Radio")
                        || meta.type.contains("Checkbox"))) continue;

            grouped.computeIfAbsent(a.getQuestionId(), k -> new ArrayList<>())
                    .add(a.getAnswerText());
        }

        return grouped.entrySet().stream()
                .map(e -> {
                    OpenEndedItem item = new OpenEndedItem();
                    item.setQuestionId(e.getKey());
                    QuestionMeta meta = metaMap.get(e.getKey());
                    item.setQuestionText(meta != null ? meta.text : "Question " + e.getKey());
                    item.setAnswers(e.getValue());
                    return item;
                })
                .collect(Collectors.toList());
    }

    // --- Question metadata from pages JSON ---

    private static class QuestionMeta {
        String text;
        String type;
        String pageLabel;
        int pageIndex;
    }

    @SuppressWarnings("unchecked")
    private Map<Long, QuestionMeta> buildQuestionMetaMap(String pagesJson) {
        Map<Long, QuestionMeta> map = new HashMap<>();
        if (pagesJson == null || pagesJson.isBlank()) return map;

        try {
            List<Map<String, Object>> pages = objectMapper.readValue(
                    pagesJson, new TypeReference<List<Map<String, Object>>>() {});

            for (int pi = 0; pi < pages.size(); pi++) {
                Map<String, Object> page = pages.get(pi);
                String pageLabel = (String) page.getOrDefault("title", "Page " + (pi + 1));

                Object questionsObj = page.get("questions");
                if (!(questionsObj instanceof List)) continue;

                List<Map<String, Object>> questions = (List<Map<String, Object>>) questionsObj;
                for (int qi = 0; qi < questions.size(); qi++) {
                    Map<String, Object> q = questions.get(qi);
                    QuestionMeta meta = new QuestionMeta();
                    meta.text = (String) q.get("questionText");
                    meta.type = (String) q.get("questionType");
                    meta.pageLabel = pageLabel;
                    meta.pageIndex = pi;

                    // Try explicit questionId first, then derive from sort order
                    Object qIdObj = q.get("questionId");
                    if (qIdObj != null) {
                        try {
                            map.put(Long.parseLong(String.valueOf(qIdObj)), meta);
                        } catch (NumberFormatException ignored) {}
                    }

                    // Also map by the DB question ID (sort_order based)
                    // Questions for survey 1 start at ID 51, sort_order 1-40
                    // We use a heuristic: pageIndex * maxQuestionsPerPage + questionIndex
                    // But more reliably, we'll match by question text later
                }
            }

            // If we couldn't map by explicit IDs, try to match by querying
            // For now, build a text-based lookup as fallback
            log.debug("Built question meta map with {} entries from pages JSON", map.size());
        } catch (Exception e) {
            log.warn("Failed to parse pages JSON for analytics: {}", e.getMessage());
        }

        return map;
    }

    /**
     * Enrich the question meta map with data from the SURVEY_QUESTIONS table.
     * DB questions have numeric IDs (51, 52, ...) and sort_order.
     * We map each DB question to its page label using the pages JSON structure.
     */
    @SuppressWarnings("unchecked")
    private void enrichMetaFromDbQuestions(Map<Long, QuestionMeta> map,
                                           List<SurveyQuestion> dbQuestions,
                                           String pagesJson) {
        // Parse pages JSON to get page labels by sort order
        List<String> pageLabels = new ArrayList<>();
        List<Integer> questionsPerPage = new ArrayList<>();
        if (pagesJson != null && !pagesJson.isBlank()) {
            try {
                List<Map<String, Object>> pages = objectMapper.readValue(
                        pagesJson, new TypeReference<List<Map<String, Object>>>() {});
                for (Map<String, Object> page : pages) {
                    pageLabels.add((String) page.getOrDefault("title", "Page"));
                    Object qObj = page.get("questions");
                    questionsPerPage.add(qObj instanceof List ? ((List<?>) qObj).size() : 0);
                }
            } catch (Exception e) {
                log.warn("Failed to parse pages JSON for page labels: {}", e.getMessage());
            }
        }

        // Map sort_order to page label
        for (SurveyQuestion q : dbQuestions) {
            if (map.containsKey(q.getQuestionId())) continue;

            QuestionMeta meta = new QuestionMeta();
            meta.text = q.getQuestionText();
            meta.type = q.getQuestionType();

            // Determine which page this question belongs to based on sort_order
            int sortOrder = q.getSortOrder() != null ? q.getSortOrder() : 0;
            int cumulative = 0;
            meta.pageLabel = "Unknown";
            meta.pageIndex = 0;
            for (int i = 0; i < questionsPerPage.size(); i++) {
                cumulative += questionsPerPage.get(i);
                if (sortOrder <= cumulative) {
                    meta.pageLabel = pageLabels.get(i);
                    meta.pageIndex = i;
                    break;
                }
            }

            map.put(q.getQuestionId(), meta);
        }

        log.debug("Enriched question meta map to {} entries from DB questions", map.size());
    }
}
