package com.teammatevoices.service;

import com.teammatevoices.dto.SurveyDTO;
import com.teammatevoices.model.Survey;
import com.teammatevoices.repository.SurveyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Pulse survey automation — creates recurring survey instances.
 *
 * Runs daily to check for surveys with a frequency set and
 * nextScheduledAt in the past. When found:
 * 1. Clones the survey (new copy with DRAFT status)
 * 2. Updates the parent's nextScheduledAt to the next interval
 */
@Service
public class PulseSurveyService {

    private static final Logger log = LoggerFactory.getLogger(PulseSurveyService.class);

    private final SurveyRepository surveyRepository;
    private final SurveyService surveyService;

    public PulseSurveyService(SurveyRepository surveyRepository,
                              SurveyService surveyService) {
        this.surveyRepository = surveyRepository;
        this.surveyService = surveyService;
    }

    /**
     * Runs daily at 6 AM to process recurring surveys.
     */
    @Scheduled(cron = "0 0 6 * * *")
    @Transactional
    public void processRecurringSurveys() {
        log.info("Checking for recurring surveys due to send...");

        List<Survey> allSurveys = surveyRepository.findAll();
        int processed = 0;

        for (Survey survey : allSurveys) {
            if (survey.getFrequency() == null || survey.getFrequency().isBlank()) continue;
            if ("ONCE".equalsIgnoreCase(survey.getFrequency())) continue;
            if (survey.getNextScheduledAt() == null) continue;
            if (survey.getNextScheduledAt().isAfter(LocalDateTime.now())) continue;

            try {
                processPulseSurvey(survey);
                processed++;
            } catch (Exception e) {
                log.error("Failed to process pulse survey {}: {}", survey.getSurveyId(), e.getMessage());
            }
        }

        log.info("Pulse survey check complete: {} surveys processed", processed);
    }

    private void processPulseSurvey(Survey parentSurvey) {
        log.info("Creating new pulse instance for survey {} (frequency: {})",
                parentSurvey.getSurveyId(), parentSurvey.getFrequency());

        // Clone the survey
        SurveyDTO cloned = surveyService.cloneSurvey(parentSurvey.getSurveyId());

        // Update clone metadata
        Survey cloneSurvey = surveyRepository.findById(cloned.getSurveyId()).orElse(null);
        if (cloneSurvey != null) {
            cloneSurvey.setParentSurveyId(parentSurvey.getSurveyId());
            cloneSurvey.setTitle(parentSurvey.getTitle() + " — " + formatCycleLabel());
            surveyRepository.save(cloneSurvey);
        }

        // Update parent's next scheduled date
        parentSurvey.setNextScheduledAt(calculateNextSchedule(parentSurvey.getFrequency()));
        surveyRepository.save(parentSurvey);

        log.info("Created pulse survey instance {} from parent {}",
                cloned.getSurveyId(), parentSurvey.getSurveyId());
    }

    private LocalDateTime calculateNextSchedule(String frequency) {
        return switch (frequency.toUpperCase()) {
            case "WEEKLY" -> LocalDateTime.now().plusWeeks(1);
            case "MONTHLY" -> LocalDateTime.now().plusMonths(1);
            case "QUARTERLY" -> LocalDateTime.now().plusMonths(3);
            case "ANNUALLY" -> LocalDateTime.now().plusYears(1);
            default -> LocalDateTime.now().plusMonths(1);
        };
    }

    private String formatCycleLabel() {
        LocalDateTime now = LocalDateTime.now();
        int quarter = (now.getMonthValue() - 1) / 3 + 1;
        return now.getYear() + " Q" + quarter;
    }
}
