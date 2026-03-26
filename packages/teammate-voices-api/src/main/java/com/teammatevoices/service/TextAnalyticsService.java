package com.teammatevoices.service;

import com.teammatevoices.dto.TextAnalyticsDTO;
import com.teammatevoices.dto.TextAnalyticsDTO.*;
import com.teammatevoices.dto.SurveyAnalyticsDTO.OpenEndedItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Text analytics service using a built-in AFINN-style sentiment lexicon.
 * No external API needed — works entirely offline with keyword matching.
 */
@Service
public class TextAnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(TextAnalyticsService.class);

    // AFINN-inspired sentiment lexicon (subset of most common workplace words)
    private static final Map<String, Integer> SENTIMENT_LEXICON = new HashMap<>();
    static {
        // Positive words (+1 to +3)
        String[] pos3 = {"excellent","outstanding","amazing","fantastic","wonderful","superb","exceptional"};
        String[] pos2 = {"great","good","love","helpful","supportive","collaborative","rewarding","enjoyable",
                "effective","meaningful","valuable","responsive","inclusive","welcoming","empowering","inspiring"};
        String[] pos1 = {"nice","okay","fine","decent","adequate","comfortable","clear","fair","open",
                "flexible","accessible","friendly","positive","professional","improved","growing"};

        // Negative words (-1 to -3)
        String[] neg3 = {"terrible","horrible","awful","toxic","hostile","discriminatory"};
        String[] neg2 = {"poor","bad","frustrating","stressful","overwhelming","unclear","confusing",
                "disorganized","micromanaging","unfair","isolated","disconnected","ignored","burnout"};
        String[] neg1 = {"slow","limited","lacking","difficult","challenging","inconsistent","busy",
                "insufficient","boring","repetitive","rigid","outdated","delayed","unclear"};

        for (String w : pos3) SENTIMENT_LEXICON.put(w, 3);
        for (String w : pos2) SENTIMENT_LEXICON.put(w, 2);
        for (String w : pos1) SENTIMENT_LEXICON.put(w, 1);
        for (String w : neg3) SENTIMENT_LEXICON.put(w, -3);
        for (String w : neg2) SENTIMENT_LEXICON.put(w, -2);
        for (String w : neg1) SENTIMENT_LEXICON.put(w, -1);
    }

    private static final Set<String> STOP_WORDS = Set.of(
            "the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","it",
            "was","are","were","be","been","being","have","has","had","do","does","did","will","would",
            "could","should","may","might","shall","can","that","this","these","those","i","me","my",
            "we","our","you","your","he","she","they","them","their","its","not","no","very","more",
            "most","just","also","so","than","then","too","only","about","into","over","after","before",
            "between","under","above","up","down","out","off","all","each","every","both","few","some",
            "any","many","much","other","another","such","what","which","who","whom","how","when","where",
            "why","if","because","as","while","although","though","until","since","during","through"
    );

    /**
     * Analyze sentiment and extract keywords from open-ended survey responses.
     */
    public TextAnalyticsDTO analyze(List<OpenEndedItem> openEndedItems) {
        log.info("Analyzing text for {} open-ended questions", openEndedItems.size());

        TextAnalyticsDTO dto = new TextAnalyticsDTO();

        int totalPositive = 0, totalNeutral = 0, totalNegative = 0;
        Map<String, int[]> globalKeywords = new LinkedHashMap<>(); // word -> [count, sentimentSum]
        List<QuestionSentiment> questionSentiments = new ArrayList<>();

        for (OpenEndedItem item : openEndedItems) {
            QuestionSentiment qs = new QuestionSentiment();
            qs.setQuestionId(item.getQuestionId());
            qs.setQuestionText(item.getQuestionText());
            qs.setTotalAnswers(item.getAnswers().size());

            int qPos = 0, qNeu = 0, qNeg = 0;
            double sentimentSum = 0;
            List<AnswerSentiment> answerSentiments = new ArrayList<>();

            for (String answer : item.getAnswers()) {
                double score = analyzeSentiment(answer);
                String label = score > 0.5 ? "positive" : (score < -0.5 ? "negative" : "neutral");

                if (score > 0.5) { qPos++; totalPositive++; }
                else if (score < -0.5) { qNeg++; totalNegative++; }
                else { qNeu++; totalNeutral++; }

                sentimentSum += score;
                answerSentiments.add(new AnswerSentiment(answer, Math.round(score * 100.0) / 100.0, label));

                // Extract keywords
                extractKeywords(answer, globalKeywords);
            }

            qs.setPositive(qPos);
            qs.setNeutral(qNeu);
            qs.setNegative(qNeg);
            qs.setAvgSentiment(item.getAnswers().isEmpty() ? 0 :
                    Math.round(sentimentSum / item.getAnswers().size() * 100.0) / 100.0);
            qs.setAnswers(answerSentiments);
            questionSentiments.add(qs);
        }

        dto.setSentimentDistribution(new SentimentDistribution(totalPositive, totalNeutral, totalNegative));
        dto.setQuestionSentiments(questionSentiments);

        // Top 20 keywords by frequency
        List<KeywordItem> topKeywords = globalKeywords.entrySet().stream()
                .sorted((a, b) -> Integer.compare(b.getValue()[0], a.getValue()[0]))
                .limit(20)
                .map(e -> new KeywordItem(e.getKey(), e.getValue()[0],
                        e.getValue()[0] > 0 ? (double) e.getValue()[1] / e.getValue()[0] : 0))
                .collect(Collectors.toList());
        dto.setTopKeywords(topKeywords);

        log.info("Text analysis complete: {} positive, {} neutral, {} negative, {} keywords",
                totalPositive, totalNeutral, totalNegative, topKeywords.size());
        return dto;
    }

    /**
     * Compute sentiment score for a text using the lexicon.
     * Returns value between -3 and +3 (normalized).
     */
    private double analyzeSentiment(String text) {
        if (text == null || text.isBlank()) return 0;

        String[] words = text.toLowerCase().replaceAll("[^a-z\\s]", "").split("\\s+");
        int totalScore = 0;
        int matchedWords = 0;

        for (String word : words) {
            Integer score = SENTIMENT_LEXICON.get(word);
            if (score != null) {
                totalScore += score;
                matchedWords++;
            }
        }

        return matchedWords == 0 ? 0 : (double) totalScore / matchedWords;
    }

    /**
     * Extract meaningful keywords from text (excluding stop words).
     */
    private void extractKeywords(String text, Map<String, int[]> keywords) {
        if (text == null || text.isBlank()) return;

        String[] words = text.toLowerCase().replaceAll("[^a-z\\s]", "").split("\\s+");
        for (String word : words) {
            if (word.length() < 3 || STOP_WORDS.contains(word)) continue;

            keywords.computeIfAbsent(word, k -> new int[]{0, 0});
            keywords.get(word)[0]++;
            Integer sentiment = SENTIMENT_LEXICON.get(word);
            if (sentiment != null) {
                keywords.get(word)[1] += sentiment;
            }
        }
    }
}
