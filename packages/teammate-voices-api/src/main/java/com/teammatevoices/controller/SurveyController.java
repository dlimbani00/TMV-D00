package com.teammatevoices.controller;

import com.teammatevoices.dto.SurveyDTO;
import com.teammatevoices.service.SurveyService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/surveys")
public class SurveyController {

    private static final Logger log = LoggerFactory.getLogger(SurveyController.class);

    private final SurveyService surveyService;

    public SurveyController(SurveyService surveyService) {
        this.surveyService = surveyService;
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

    @PostMapping("/{id}/publish")
    public ResponseEntity<SurveyDTO> publishSurvey(@PathVariable Long id) {
        log.info("POST /surveys/{}/publish", id);
        return ResponseEntity.ok(surveyService.publishSurvey(id));
    }

    @PostMapping("/{id}/clone")
    public ResponseEntity<SurveyDTO> cloneSurvey(@PathVariable Long id) {
        log.info("POST /surveys/{}/clone", id);
        SurveyDTO cloned = surveyService.cloneSurvey(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(cloned);
    }
}
