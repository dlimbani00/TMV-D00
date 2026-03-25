package com.teammatevoices.controller;

import com.teammatevoices.dto.SurveyDTO;
import com.teammatevoices.dto.SurveyResponseDTO;
import com.teammatevoices.dto.request.SubmitSurveyRequest;
import com.teammatevoices.model.Dispatch;
import com.teammatevoices.service.DispatchService;
import com.teammatevoices.service.ResponseService;
import com.teammatevoices.service.SurveyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ResponseController {

    private static final Logger log = LoggerFactory.getLogger(ResponseController.class);

    private final ResponseService responseService;
    private final SurveyService surveyService;
    private final DispatchService dispatchService;

    public ResponseController(ResponseService responseService,
                              SurveyService surveyService,
                              DispatchService dispatchService) {
        this.responseService = responseService;
        this.surveyService = surveyService;
        this.dispatchService = dispatchService;
    }

    /* ================================================================
       Token-based endpoints (tracked dispatch)
       ================================================================ */

    /** Load survey for a respondent via dispatch token */
    @GetMapping("/respond/{token}")
    public ResponseEntity<SurveyDTO> getSurveyByToken(@PathVariable String token) {
        log.info("GET /respond/{}", token);
        // Look up dispatch by token → get surveyId → return survey
        Dispatch dispatch = dispatchService.getDispatchByToken(token);
        SurveyDTO survey = surveyService.getSurveyById(dispatch.getSurveyId());
        return ResponseEntity.ok(survey);
    }

    /** Submit response via dispatch token */
    @PostMapping("/respond/{token}/submit")
    public ResponseEntity<Map<String, Object>> submitViaToken(
            @PathVariable String token,
            @RequestBody SubmitSurveyRequest request) {
        log.info("POST /respond/{}/submit", token);
        Long responseId = responseService.submitViaToken(token, request.getAnswers());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("responseId", responseId, "message", "Response submitted successfully"));
    }

    /* ================================================================
       Public link endpoints (ad-hoc / anonymous)
       ================================================================ */

    /** Load survey for public respondent */
    @GetMapping("/surveys/{surveyId}/public")
    public ResponseEntity<SurveyDTO> getPublicSurvey(@PathVariable Long surveyId) {
        log.info("GET /surveys/{}/public", surveyId);
        SurveyDTO survey = surveyService.getSurveyById(surveyId);
        return ResponseEntity.ok(survey);
    }

    /** Submit public/anonymous response */
    @PostMapping("/surveys/{surveyId}/public/submit")
    public ResponseEntity<Map<String, Object>> submitPublic(
            @PathVariable Long surveyId,
            @RequestBody SubmitSurveyRequest request) {
        log.info("POST /surveys/{}/public/submit", surveyId);
        Long responseId = responseService.submitPublic(surveyId, request.getAnswers());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("responseId", responseId, "message", "Response submitted successfully"));
    }

    /* ================================================================
       Admin endpoints (view responses)
       ================================================================ */

    /** List all responses for a survey */
    @GetMapping("/surveys/{surveyId}/responses")
    public ResponseEntity<List<SurveyResponseDTO>> getResponses(@PathVariable Long surveyId) {
        log.info("GET /surveys/{}/responses", surveyId);
        return ResponseEntity.ok(responseService.getResponsesForSurvey(surveyId));
    }

    /** Get single response detail */
    @GetMapping("/surveys/{surveyId}/responses/{responseId}")
    public ResponseEntity<SurveyResponseDTO> getResponseDetail(
            @PathVariable Long surveyId,
            @PathVariable Long responseId) {
        log.info("GET /surveys/{}/responses/{}", surveyId, responseId);
        return ResponseEntity.ok(responseService.getResponseDetail(responseId));
    }

    /** Count responses for a survey */
    @GetMapping("/surveys/{surveyId}/responses/count")
    public ResponseEntity<Map<String, Long>> getResponseCount(@PathVariable Long surveyId) {
        log.info("GET /surveys/{}/responses/count", surveyId);
        return ResponseEntity.ok(Map.of("count", responseService.countResponses(surveyId)));
    }
}
