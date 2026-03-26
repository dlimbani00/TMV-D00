package com.teammatevoices.controller;

import com.teammatevoices.dto.LogicEvaluationResultDTO;
import com.teammatevoices.dto.LogicRuleDTO;
import com.teammatevoices.dto.SurveyAnalyticsDTO;
import com.teammatevoices.dto.SurveyDTO;
import com.teammatevoices.dto.TextAnalyticsDTO;
import com.teammatevoices.dto.TrendDTO;
import com.teammatevoices.dto.request.EvaluateLogicRequest;
import com.teammatevoices.dto.request.SaveLogicRequest;
import com.teammatevoices.service.AnalyticsService;
import com.teammatevoices.service.LogicEvaluatorService;
import com.teammatevoices.service.SurveyService;
import com.teammatevoices.service.SurveyWorkflowService;
import com.teammatevoices.service.TextAnalyticsService;
import com.teammatevoices.service.TrendService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/surveys")
public class SurveyController {

    private static final Logger log = LoggerFactory.getLogger(SurveyController.class);

    private final SurveyService surveyService;
    private final AnalyticsService analyticsService;
    private final TrendService trendService;
    private final TextAnalyticsService textAnalyticsService;
    private final LogicEvaluatorService logicEvaluatorService;
    private final SurveyWorkflowService workflowService;
    private final ObjectMapper objectMapper;

    public SurveyController(SurveyService surveyService,
                            AnalyticsService analyticsService,
                            TrendService trendService,
                            TextAnalyticsService textAnalyticsService,
                            LogicEvaluatorService logicEvaluatorService,
                            SurveyWorkflowService workflowService,
                            ObjectMapper objectMapper) {
        this.surveyService = surveyService;
        this.analyticsService = analyticsService;
        this.trendService = trendService;
        this.textAnalyticsService = textAnalyticsService;
        this.logicEvaluatorService = logicEvaluatorService;
        this.workflowService = workflowService;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<List<SurveyDTO>> getAllSurveys() {
        log.info("GET /surveys");
        return ResponseEntity.ok(surveyService.getAllSurveys());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SurveyDTO> getSurveyById(@PathVariable Long id) {
        log.info("GET /surveys/{}", id);
        return ResponseEntity.ok(surveyService.getSurveyById(id));
    }

    @PostMapping
    public ResponseEntity<SurveyDTO> createSurvey(@Valid @RequestBody SurveyDTO surveyDTO) {
        log.info("POST /surveys - {}", surveyDTO.getTitle());
        SurveyDTO created = surveyService.createSurvey(surveyDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SurveyDTO> updateSurvey(@PathVariable Long id, @Valid @RequestBody SurveyDTO surveyDTO) {
        log.info("PUT /surveys/{}", id);
        return ResponseEntity.ok(surveyService.updateSurvey(id, surveyDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSurvey(@PathVariable Long id) {
        log.info("DELETE /surveys/{}", id);
        surveyService.deleteSurvey(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Publish a survey via the workflow orchestrator.
     * Validates → state change → notifies admin → audits.
     */
    @PostMapping("/{id}/publish")
    public ResponseEntity<Map<String, Object>> publishSurvey(
            @PathVariable Long id, HttpServletRequest request) {
        log.info("POST /surveys/{}/publish", id);
        String ip = request.getRemoteAddr();
        SurveyWorkflowService.PublishResult result = workflowService.publish(id, "admin", ip);

        Map<String, Object> response = new java.util.LinkedHashMap<>();
        response.put("survey", result.survey());
        response.put("emailReadiness", result.emailReadiness().passed() ? "PASSED" : "WARNINGS");
        response.put("notificationSent", result.notificationSent());
        return ResponseEntity.ok(response);
    }

    /**
     * Unpublish: ACTIVE → DRAFT (allow edits again).
     */
    @PostMapping("/{id}/unpublish")
    public ResponseEntity<SurveyDTO> unpublishSurvey(
            @PathVariable Long id, HttpServletRequest request) {
        log.info("POST /surveys/{}/unpublish", id);
        return ResponseEntity.ok(workflowService.unpublish(id, "admin", request.getRemoteAddr()));
    }

    /**
     * Close: ACTIVE → CLOSED (stop accepting responses).
     */
    @PostMapping("/{id}/close")
    public ResponseEntity<SurveyDTO> closeSurvey(
            @PathVariable Long id, HttpServletRequest request) {
        log.info("POST /surveys/{}/close", id);
        return ResponseEntity.ok(workflowService.close(id, "admin", request.getRemoteAddr()));
    }

    /**
     * Reopen: CLOSED → ACTIVE (accept responses again).
     */
    @PostMapping("/{id}/reopen")
    public ResponseEntity<SurveyDTO> reopenSurvey(
            @PathVariable Long id, HttpServletRequest request) {
        log.info("POST /surveys/{}/reopen", id);
        return ResponseEntity.ok(workflowService.reopen(id, "admin", request.getRemoteAddr()));
    }

    @PostMapping("/{id}/clone")
    public ResponseEntity<SurveyDTO> cloneSurvey(@PathVariable Long id) {
        log.info("POST /surveys/{}/clone", id);
        SurveyDTO cloned = surveyService.cloneSurvey(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(cloned);
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<SurveyAnalyticsDTO> getAnalytics(
            @PathVariable Long id,
            @RequestParam(required = false) Map<String, String> allParams) {
        log.info("GET /surveys/{}/analytics params={}", id, allParams);
        // Extract demographic filters (params starting with "filter_")
        Map<String, String> filters = new java.util.HashMap<>();
        if (allParams != null) {
            allParams.forEach((key, value) -> {
                if (key.startsWith("filter_") && value != null && !value.isBlank()) {
                    filters.put(key.substring(7), value); // strip "filter_" prefix
                }
            });
        }
        return ResponseEntity.ok(analyticsService.getAnalytics(id, filters.isEmpty() ? null : filters));
    }

    @GetMapping("/{id}/trends")
    public ResponseEntity<TrendDTO> getTrends(
            @PathVariable Long id,
            @RequestParam(required = false) Long compareWith) {
        log.info("GET /surveys/{}/trends compareWith={}", id, compareWith);
        if (compareWith != null) {
            return ResponseEntity.ok(trendService.compareSurveys(id, compareWith));
        }
        // If no comparison, get trend by program
        SurveyDTO survey = surveyService.getSurveyById(id);
        if (survey.getProgramId() != null) {
            return ResponseEntity.ok(trendService.getTrendByProgram(survey.getProgramId()));
        }
        // Fallback: just return current survey as single point
        return ResponseEntity.ok(trendService.compareSurveys(id, id));
    }

    @GetMapping("/{id}/text-analytics")
    public ResponseEntity<TextAnalyticsDTO> getTextAnalytics(@PathVariable Long id) {
        log.info("GET /surveys/{}/text-analytics", id);
        SurveyAnalyticsDTO analytics = analyticsService.getAnalytics(id);
        TextAnalyticsDTO result = textAnalyticsService.analyze(analytics.getOpenEndedResponses());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/logic")
    public ResponseEntity<List<LogicRuleDTO>> getLogicRules(@PathVariable Long id) {
        log.info("GET /surveys/{}/logic", id);
        SurveyDTO survey = surveyService.getSurveyById(id);
        List<LogicRuleDTO> rules = parseLogicJson(survey.getLogicJson());
        return ResponseEntity.ok(rules);
    }

    /**
     * Save logic rules for a survey with full validation.
     *
     * The middleware validates before persisting:
     * - Structural: valid rule types, operators, actions
     * - Referential: question IDs exist in this survey
     * - Business: no circular skips, no hiding required questions
     *
     * Returns 422 with detailed error messages if validation fails.
     */
    @PutMapping("/{id}/logic")
    public ResponseEntity<List<LogicRuleDTO>> saveLogicRules(
            @PathVariable Long id,
            @Valid @RequestBody SaveLogicRequest request) {
        log.info("PUT /surveys/{}/logic", id);
        surveyService.updateLogicRules(id, request.getRules());
        return ResponseEntity.ok(request.getRules());
    }

    @PostMapping("/{id}/evaluate")
    public ResponseEntity<LogicEvaluationResultDTO> evaluateLogic(@PathVariable Long id, @RequestBody EvaluateLogicRequest request) {
        log.info("POST /surveys/{}/evaluate", id);
        SurveyDTO survey = surveyService.getSurveyById(id);
        List<LogicRuleDTO> rules = parseLogicJson(survey.getLogicJson());
        LogicEvaluationResultDTO result = logicEvaluatorService.evaluate(rules, request.getAnswers());
        return ResponseEntity.ok(result);
    }

    private List<LogicRuleDTO> parseLogicJson(String logicJson) {
        if (logicJson == null || logicJson.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(logicJson, new TypeReference<List<LogicRuleDTO>>() {});
        } catch (JsonProcessingException e) {
            log.error("Failed to parse logic JSON", e);
            return Collections.emptyList();
        }
    }
}
