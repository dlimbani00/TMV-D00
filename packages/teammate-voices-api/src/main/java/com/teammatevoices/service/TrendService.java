package com.teammatevoices.service;

import com.teammatevoices.dto.SurveyAnalyticsDTO;
import com.teammatevoices.dto.SurveyDTO;
import com.teammatevoices.dto.TrendDTO;
import com.teammatevoices.dto.TrendDTO.SurveySnapshot;
import com.teammatevoices.dto.TrendDTO.TrendPoint;
import com.teammatevoices.repository.SurveyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrendService {

    private static final Logger log = LoggerFactory.getLogger(TrendService.class);

    private final AnalyticsService analyticsService;
    private final SurveyService surveyService;
    private final SurveyRepository surveyRepository;

    public TrendService(AnalyticsService analyticsService,
                        SurveyService surveyService,
                        SurveyRepository surveyRepository) {
        this.analyticsService = analyticsService;
        this.surveyService = surveyService;
        this.surveyRepository = surveyRepository;
    }

    /**
     * Compare two surveys side-by-side with delta calculations.
     */
    @Transactional(readOnly = true)
    public TrendDTO compareSurveys(Long currentId, Long previousId) {
        log.info("Comparing surveys {} vs {}", currentId, previousId);

        SurveyAnalyticsDTO currentAnalytics = analyticsService.getAnalytics(currentId);
        SurveyAnalyticsDTO previousAnalytics = analyticsService.getAnalytics(previousId);

        SurveyDTO currentSurvey = surveyService.getSurveyById(currentId);
        SurveyDTO previousSurvey = surveyService.getSurveyById(previousId);

        TrendDTO dto = new TrendDTO();
        dto.setCurrent(toSnapshot(currentSurvey, currentAnalytics));
        dto.setPrevious(toSnapshot(previousSurvey, previousAnalytics));

        // Build trend line from both
        List<TrendPoint> trendLine = new ArrayList<>();
        trendLine.add(new TrendPoint(
                previousSurvey.getCycle() != null ? previousSurvey.getCycle() : previousSurvey.getTitle(),
                previousAnalytics.getAverageScore(),
                previousAnalytics.getEnps(),
                previousAnalytics.getTotalResponses()
        ));
        trendLine.add(new TrendPoint(
                currentSurvey.getCycle() != null ? currentSurvey.getCycle() : currentSurvey.getTitle(),
                currentAnalytics.getAverageScore(),
                currentAnalytics.getEnps(),
                currentAnalytics.getTotalResponses()
        ));
        dto.setTrendLine(trendLine);

        return dto;
    }

    /**
     * Get trend data for all surveys in a program.
     */
    @Transactional(readOnly = true)
    public TrendDTO getTrendByProgram(Long programId) {
        log.info("Getting trend for program {}", programId);

        List<SurveyDTO> surveys = surveyService.getAllSurveys().stream()
                .filter(s -> programId.equals(s.getProgramId()))
                .collect(Collectors.toList());

        TrendDTO dto = new TrendDTO();
        List<TrendPoint> trendLine = new ArrayList<>();

        for (SurveyDTO survey : surveys) {
            try {
                SurveyAnalyticsDTO analytics = analyticsService.getAnalytics(survey.getSurveyId());
                if (analytics.getTotalResponses() > 0) {
                    trendLine.add(new TrendPoint(
                            survey.getCycle() != null ? survey.getCycle() : survey.getTitle(),
                            analytics.getAverageScore(),
                            analytics.getEnps(),
                            analytics.getTotalResponses()
                    ));
                }

                // Set current as the latest with responses
                if (analytics.getTotalResponses() > 0) {
                    dto.setCurrent(toSnapshot(survey, analytics));
                }
            } catch (Exception e) {
                log.warn("Failed to compute analytics for survey {}: {}", survey.getSurveyId(), e.getMessage());
            }
        }

        dto.setTrendLine(trendLine);
        return dto;
    }

    private SurveySnapshot toSnapshot(SurveyDTO survey, SurveyAnalyticsDTO analytics) {
        SurveySnapshot snapshot = new SurveySnapshot();
        snapshot.setSurveyId(survey.getSurveyId());
        snapshot.setTitle(survey.getTitle());
        snapshot.setCycle(survey.getCycle());
        snapshot.setTotalResponses(analytics.getTotalResponses());
        snapshot.setAverageScore(analytics.getAverageScore());
        snapshot.setEnps(analytics.getEnps());
        snapshot.setResponseRate(analytics.getTotalDispatched() > 0
                ? Math.round((double) analytics.getTotalResponses() / analytics.getTotalDispatched() * 100)
                : 0);
        return snapshot;
    }
}
