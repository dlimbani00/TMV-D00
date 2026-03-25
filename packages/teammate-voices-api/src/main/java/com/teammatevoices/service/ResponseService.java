package com.teammatevoices.service;

import com.teammatevoices.dto.SurveyResponseDTO;
import com.teammatevoices.dto.SurveyResponseDTO.SurveyAnswerDTO;
import com.teammatevoices.exception.BusinessRuleException;
import com.teammatevoices.exception.DuplicateResponseException;
import com.teammatevoices.exception.ResourceNotFoundException;
import com.teammatevoices.model.Dispatch;
import com.teammatevoices.model.Survey;
import com.teammatevoices.model.SurveyAnswer;
import com.teammatevoices.model.SurveyResponse;
import com.teammatevoices.model.Program;
import com.teammatevoices.repository.DispatchRepository;
import com.teammatevoices.repository.ProgramRepository;
import com.teammatevoices.repository.SurveyRepository;
import com.teammatevoices.repository.SurveyResponseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResponseService {

    private static final Logger log = LoggerFactory.getLogger(ResponseService.class);

    private final SurveyRepository surveyRepository;
    private final SurveyResponseRepository responseRepository;
    private final DispatchRepository dispatchRepository;
    private final ProgramRepository programRepository;

    public ResponseService(SurveyRepository surveyRepository,
                           SurveyResponseRepository responseRepository,
                           DispatchRepository dispatchRepository,
                           ProgramRepository programRepository) {
        this.surveyRepository = surveyRepository;
        this.responseRepository = responseRepository;
        this.dispatchRepository = dispatchRepository;
        this.programRepository = programRepository;
    }

    /**
     * Submit a response via dispatch token (tracked participant).
     */
    @Transactional
    public Long submitViaToken(String token, Map<String, String> answers) {
        log.info("Submitting response via token");

        Dispatch dispatch = dispatchRepository.findByDispatchToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch token", token));

        Survey survey = surveyRepository.findById(dispatch.getSurveyId())
                .orElseThrow(() -> new ResourceNotFoundException("Survey", dispatch.getSurveyId()));

        if (!"ACTIVE".equals(survey.getStatus())) {
            throw new BusinessRuleException("This survey is not currently accepting responses.");
        }

        // Check for duplicate
        responseRepository.findBySurvey_SurveyIdAndParticipantIdAndIsComplete(
                survey.getSurveyId(), dispatch.getParticipantId(), true
        ).ifPresent(existing -> {
            throw new DuplicateResponseException(dispatch.getParticipantId(), survey.getSurveyId());
        });

        SurveyResponse response = buildResponse(survey, answers);
        response.setParticipantId(dispatch.getParticipantId());
        response.setDispatchId(dispatch.getDispatchId());

        responseRepository.save(response);

        // Update dispatch
        dispatch.setDispatchStatus("SUBMITTED");
        dispatch.setSubmittedAt(LocalDateTime.now());
        dispatchRepository.save(dispatch);

        // Check if all dispatches for this survey are completed → update program to COMPLETED
        updateProgramProgressIfAllComplete(survey);

        log.info("Response {} submitted via token for survey {}", response.getResponseId(), survey.getSurveyId());
        return response.getResponseId();
    }

    /**
     * Submit an anonymous/public response (no dispatch tracking).
     */
    @Transactional
    public Long submitPublic(Long surveyId, Map<String, String> answers) {
        log.info("Submitting public response for survey {}", surveyId);

        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new ResourceNotFoundException("Survey", surveyId));

        if (!"ACTIVE".equals(survey.getStatus())) {
            throw new BusinessRuleException("This survey is not currently accepting responses.");
        }

        SurveyResponse response = buildResponse(survey, answers);
        responseRepository.save(response);

        log.info("Public response {} submitted for survey {}", response.getResponseId(), surveyId);
        return response.getResponseId();
    }

    /**
     * Get all responses for a survey (admin).
     */
    @Transactional(readOnly = true)
    public List<SurveyResponseDTO> getResponsesForSurvey(Long surveyId) {
        return responseRepository.findBySurvey_SurveyId(surveyId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get a single response with answers (admin).
     */
    @Transactional(readOnly = true)
    public SurveyResponseDTO getResponseDetail(Long responseId) {
        SurveyResponse response = responseRepository.findById(responseId)
                .orElseThrow(() -> new ResourceNotFoundException("Response", responseId));
        return toDTO(response);
    }

    /**
     * Count responses for a survey.
     */
    @Transactional(readOnly = true)
    public long countResponses(Long surveyId) {
        return responseRepository.countBySurvey_SurveyId(surveyId);
    }

    // --- private helpers ---

    private SurveyResponse buildResponse(Survey survey, Map<String, String> answers) {
        SurveyResponse response = new SurveyResponse();
        response.setSurvey(survey);
        response.setIsComplete(true);
        response.setStartedAt(LocalDateTime.now());
        response.setSubmittedAt(LocalDateTime.now());

        if (answers != null) {
            for (Map.Entry<String, String> entry : answers.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();
                if (value == null || value.isBlank()) continue;

                SurveyAnswer answer = new SurveyAnswer();
                answer.setResponse(response);
                answer.setAnswerText(value);

                // Try to parse questionId as Long; if it's a composite key like "PG-001-q2", store 0
                try {
                    answer.setQuestionId(Long.parseLong(key));
                } catch (NumberFormatException e) {
                    answer.setQuestionId(0L);
                    // Store the composite key in pageId for reference
                    if (key.contains("-q")) {
                        answer.setPageId(key.substring(0, key.lastIndexOf("-q")));
                    }
                }

                // For multi-select (pipe-separated), also store as JSON array
                if (value.contains("||")) {
                    String[] parts = value.split("\\|\\|");
                    StringBuilder json = new StringBuilder("[");
                    for (int i = 0; i < parts.length; i++) {
                        if (i > 0) json.append(",");
                        json.append("\"").append(parts[i].replace("\"", "\\\"")).append("\"");
                    }
                    json.append("]");
                    answer.setAnswerJson(json.toString());
                }

                // Try to parse numeric value
                try {
                    answer.setAnswerValue(Integer.parseInt(value));
                } catch (NumberFormatException ignored) {}

                response.getAnswers().add(answer);
            }
        }

        return response;
    }

    private SurveyResponseDTO toDTO(SurveyResponse r) {
        SurveyResponseDTO dto = new SurveyResponseDTO();
        dto.setResponseId(r.getResponseId());
        dto.setSurveyId(r.getSurvey().getSurveyId());
        dto.setParticipantId(r.getParticipantId());
        dto.setIsComplete(r.getIsComplete());
        dto.setSubmittedAt(r.getSubmittedAt());
        dto.setStartedAt(r.getStartedAt());
        dto.setCreatedAt(r.getCreatedAt());

        if (r.getAnswers() != null) {
            dto.setAnswers(r.getAnswers().stream().map(a -> {
                SurveyAnswerDTO aDto = new SurveyAnswerDTO();
                aDto.setAnswerId(a.getAnswerId());
                aDto.setQuestionId(a.getQuestionId());
                aDto.setPageId(a.getPageId());
                aDto.setAnswerText(a.getAnswerText());
                aDto.setAnswerValue(a.getAnswerValue());
                aDto.setAnswerJson(a.getAnswerJson());
                return aDto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }

    /**
     * Check if all dispatches for a survey are submitted.
     * If so, update the linked program's progress to COMPLETED.
     */
    private void updateProgramProgressIfAllComplete(Survey survey) {
        if (survey.getProgramId() == null) return;

        List<Dispatch> allDispatches = dispatchRepository.findBySurveyId(survey.getSurveyId());
        if (allDispatches.isEmpty()) return;

        boolean allSubmitted = allDispatches.stream()
                .allMatch(d -> "SUBMITTED".equalsIgnoreCase(d.getDispatchStatus()));

        if (allSubmitted) {
            programRepository.findById(survey.getProgramId()).ifPresent(program -> {
                program.setSurveyProgress("COMPLETED");
                programRepository.save(program);
                log.info("All dispatches submitted — updated program {} to COMPLETED", program.getProgramId());
            });
        }
    }
}
