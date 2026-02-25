package com.arya.empsurvey.controller;

import com.arya.empsurvey.dto.SurveyDTO;
import com.arya.empsurvey.service.SurveyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/surveys")
@RequiredArgsConstructor
@Slf4j
public class SurveyController {

    private final SurveyService surveyService;

    @GetMapping
    public ResponseEntity<List<SurveyDTO>> getAllSurveys() {
        log.info("GET /surveys - Fetching all surveys");
        List<SurveyDTO> surveys = surveyService.getAllSurveys();
        return ResponseEntity.ok(surveys);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SurveyDTO> getSurveyById(@PathVariable Long id) {
        log.info("GET /surveys/{} - Fetching survey by id", id);
        try {
            SurveyDTO survey = surveyService.getSurveyById(id);
            return ResponseEntity.ok(survey);
        } catch (RuntimeException e) {
            log.error("Survey not found with id: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<SurveyDTO> createSurvey(@RequestBody SurveyDTO surveyDTO) {
        log.info("POST /surveys - Creating new survey: {}", surveyDTO.getTitle());
        try {
            SurveyDTO created = surveyService.createSurvey(surveyDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            log.error("Error creating survey", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SurveyDTO> updateSurvey(
            @PathVariable Long id, 
            @RequestBody SurveyDTO surveyDTO) {
        log.info("PUT /surveys/{} - Updating survey", id);
        try {
            SurveyDTO updated = surveyService.updateSurvey(id, surveyDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            log.error("Survey not found with id: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSurvey(@PathVariable Long id) {
        log.info("DELETE /surveys/{} - Deleting survey", id);
        try {
            surveyService.deleteSurvey(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Survey not found with id: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<SurveyDTO> publishSurvey(@PathVariable Long id) {
        log.info("POST /surveys/{}/publish - Publishing survey", id);
        try {
            SurveyDTO published = surveyService.publishSurvey(id);
            return ResponseEntity.ok(published);
        } catch (RuntimeException e) {
            log.error("Survey not found with id: {}", id);
            return ResponseEntity.notFound().build();
        }
    }
}
