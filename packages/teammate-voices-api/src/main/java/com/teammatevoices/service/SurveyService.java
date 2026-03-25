package com.teammatevoices.service;

import com.teammatevoices.dto.LogicRuleDTO;
import com.teammatevoices.dto.OptionDTO;
import com.teammatevoices.dto.QuestionDTO;
import com.teammatevoices.dto.SurveyDTO;
import com.teammatevoices.exception.BusinessRuleException;
import com.teammatevoices.exception.ResourceNotFoundException;
import com.teammatevoices.model.Survey;
import com.teammatevoices.model.SurveyOption;
import com.teammatevoices.model.SurveyQuestion;
import com.teammatevoices.repository.SurveyRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SurveyService {

    private static final Logger log = LoggerFactory.getLogger(SurveyService.class);

    private final SurveyRepository surveyRepository;
    private final LogicRuleValidator logicRuleValidator;
    private final ObjectMapper objectMapper;

    public SurveyService(SurveyRepository surveyRepository,
                         LogicRuleValidator logicRuleValidator,
                         ObjectMapper objectMapper) {
        this.surveyRepository = surveyRepository;
        this.logicRuleValidator = logicRuleValidator;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public List<SurveyDTO> getAllSurveys() {
        return surveyRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SurveyDTO getSurveyById(Long id) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Survey", id));
        return toDTO(survey);
    }

    @Transactional
    public SurveyDTO createSurvey(SurveyDTO dto) {
        log.info("Creating survey: {}", dto.getTitle());
        Survey survey = toEntity(dto);
        return toDTO(surveyRepository.save(survey));
    }

    private static final java.util.Set<String> EDITABLE_STATUSES = java.util.Set.of("DRAFT", "draft");

    /** Guard: reject edits on ACTIVE/CLOSED surveys. Clone instead. */
    private void requireEditable(Survey survey) {
        if (survey.getStatus() != null && !EDITABLE_STATUSES.contains(survey.getStatus())) {
            throw new BusinessRuleException(
                "Cannot edit survey '" + survey.getTitle() + "': status is " + survey.getStatus()
                + ". Clone the survey to make changes.");
        }
    }

    @Transactional
    public SurveyDTO updateSurvey(Long id, SurveyDTO dto) {
        log.info("Updating survey: {}", id);
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Survey", id));

        requireEditable(survey);

        survey.setTitle(dto.getTitle());
        survey.setDescription(dto.getDescription());
        survey.setTemplateType(dto.getTemplateType());
        survey.setStatus(dto.getStatus());
        survey.setParticipantType(dto.getParticipantType());
        survey.setSurveyStage(dto.getSurveyStage());
        survey.setAudienceSource(dto.getAudienceSource());
        survey.setAutoSend(dto.getAutoSend());
        survey.setStartDate(dto.getStartDate());
        survey.setEndDate(dto.getEndDate());
        survey.setIsAnonymous(dto.getIsAnonymous());
        survey.setProgramId(dto.getProgramId());
        survey.setBuildStatus(dto.getBuildStatus());
        survey.setCycle(dto.getCycle());
        survey.setPages(dto.getPages());
        survey.setLogicJson(dto.getLogicJson());

        survey.getQuestions().clear();
        if (dto.getQuestions() != null) {
            dto.getQuestions().forEach(qDTO -> {
                SurveyQuestion question = toQuestionEntity(qDTO);
                survey.addQuestion(question);
            });
        }

        return toDTO(surveyRepository.save(survey));
    }

    @Transactional
    public void deleteSurvey(Long id) {
        log.info("Deleting survey: {}", id);
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Survey", id));

        requireEditable(survey);

        surveyRepository.deleteById(id);
    }

    /**
     * Validates and persists logic rules for a survey.
     *
     * The middleware acts as the "brain" here: it validates structural integrity,
     * referential integrity (question IDs exist), and business rules (no circular
     * skips, no hiding required questions) before persisting to the database.
     *
     * @param id    the survey ID
     * @param rules the logic rules to validate and save
     * @throws BusinessRuleException if validation fails
     * @throws ResourceNotFoundException if survey does not exist
     */
    @Transactional
    public void updateLogicRules(Long id, List<LogicRuleDTO> rules) {
        log.info("Validating and updating logic rules for survey: {}", id);

        // Middleware brain: validate before persisting
        logicRuleValidator.validate(id, rules);

        // Serialize validated rules to JSON for storage
        try {
            String logicJson = objectMapper.writeValueAsString(rules);
            Survey survey = surveyRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Survey", id));
            survey.setLogicJson(logicJson);
            surveyRepository.save(survey);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize logic rules for survey {}", id, e);
            throw new RuntimeException("Failed to serialize logic rules", e);
        }
    }

    /** @deprecated Use updateLogicRules(Long, List<LogicRuleDTO>) for validated saves */
    @Transactional
    public void updateLogicJson(Long id, String logicJson) {
        log.info("Updating logic rules (raw) for survey: {}", id);
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Survey", id));
        survey.setLogicJson(logicJson);
        surveyRepository.save(survey);
    }

    @Transactional
    public SurveyDTO publishSurvey(Long id) {
        log.info("Publishing survey: {}", id);
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Survey", id));
        survey.setStatus("ACTIVE");
        return toDTO(surveyRepository.save(survey));
    }

    @Transactional
    public SurveyDTO cloneSurvey(Long id) {
        log.info("Cloning survey: {}", id);
        Survey source = surveyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Survey", id));

        Survey clone = new Survey();
        clone.setTitle(source.getTitle() + " (Copy)");
        clone.setDescription(source.getDescription());
        clone.setTemplateType(source.getTemplateType());
        clone.setStatus("DRAFT");
        clone.setBuildStatus("DRAFT");
        clone.setProgramId(source.getProgramId());
        clone.setCycle(source.getCycle());
        clone.setPages(source.getPages());
        clone.setLogicJson(source.getLogicJson());
        clone.setParticipantType(source.getParticipantType());
        clone.setSurveyStage(source.getSurveyStage());
        clone.setAudienceSource(source.getAudienceSource());
        clone.setAutoSend(source.getAutoSend());
        clone.setIsAnonymous(source.getIsAnonymous());

        if (source.getQuestions() != null) {
            source.getQuestions().forEach(q -> {
                SurveyQuestion cloneQ = new SurveyQuestion();
                cloneQ.setQuestionText(q.getQuestionText());
                cloneQ.setQuestionType(q.getQuestionType());
                cloneQ.setSortOrder(q.getSortOrder());
                cloneQ.setIsRequired(q.getIsRequired());
                if (q.getOptions() != null) {
                    q.getOptions().forEach(o -> {
                        SurveyOption cloneO = new SurveyOption();
                        cloneO.setOptionText(o.getOptionText());
                        cloneO.setOptionValue(o.getOptionValue());
                        cloneO.setSortOrder(o.getSortOrder());
                        cloneQ.addOption(cloneO);
                    });
                }
                clone.addQuestion(cloneQ);
            });
        }

        return toDTO(surveyRepository.save(clone));
    }

    private SurveyDTO toDTO(Survey survey) {
        SurveyDTO dto = new SurveyDTO();
        dto.setSurveyId(survey.getSurveyId());
        dto.setTitle(survey.getTitle());
        dto.setDescription(survey.getDescription());
        dto.setTemplateType(survey.getTemplateType());
        dto.setStatus(survey.getStatus());
        dto.setParticipantType(survey.getParticipantType());
        dto.setSurveyStage(survey.getSurveyStage());
        dto.setAudienceSource(survey.getAudienceSource());
        dto.setAutoSend(survey.getAutoSend());
        dto.setProgramId(survey.getProgramId());
        dto.setBuildStatus(survey.getBuildStatus());
        dto.setCycle(survey.getCycle());
        dto.setPages(survey.getPages());
        dto.setLogicJson(survey.getLogicJson());
        dto.setCreatedBy(survey.getCreatedBy());
        dto.setStartDate(survey.getStartDate());
        dto.setEndDate(survey.getEndDate());
        dto.setIsAnonymous(survey.getIsAnonymous());
        dto.setCreatedAt(survey.getCreatedAt());
        dto.setUpdatedAt(survey.getUpdatedAt());

        if (survey.getQuestions() != null) {
            dto.setQuestions(survey.getQuestions().stream()
                    .map(this::toQuestionDTO)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    private QuestionDTO toQuestionDTO(SurveyQuestion q) {
        QuestionDTO dto = new QuestionDTO();
        dto.setQuestionId(q.getQuestionId());
        dto.setQuestionText(q.getQuestionText());
        dto.setQuestionType(q.getQuestionType());
        dto.setSortOrder(q.getSortOrder());
        dto.setIsRequired(q.getIsRequired());
        if (q.getOptions() != null) {
            dto.setOptions(q.getOptions().stream()
                    .map(this::toOptionDTO)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    private OptionDTO toOptionDTO(SurveyOption o) {
        OptionDTO dto = new OptionDTO();
        dto.setOptionId(o.getOptionId());
        dto.setOptionText(o.getOptionText());
        dto.setOptionValue(o.getOptionValue());
        dto.setSortOrder(o.getSortOrder());
        return dto;
    }

    private Survey toEntity(SurveyDTO dto) {
        Survey survey = new Survey();
        survey.setTitle(dto.getTitle());
        survey.setDescription(dto.getDescription());
        survey.setTemplateType(dto.getTemplateType() != null ? dto.getTemplateType() : "CUSTOM");
        survey.setStatus(dto.getStatus() != null ? dto.getStatus() : "DRAFT");
        survey.setBuildStatus(dto.getBuildStatus() != null ? dto.getBuildStatus() : "DRAFT");
        survey.setProgramId(dto.getProgramId());
        survey.setCycle(dto.getCycle());
        survey.setPages(dto.getPages());
        survey.setLogicJson(dto.getLogicJson());
        survey.setParticipantType(dto.getParticipantType());
        survey.setSurveyStage(dto.getSurveyStage());
        survey.setAudienceSource(dto.getAudienceSource());
        survey.setAutoSend(dto.getAutoSend());
        survey.setStartDate(dto.getStartDate());
        survey.setEndDate(dto.getEndDate());
        survey.setIsAnonymous(dto.getIsAnonymous() != null ? dto.getIsAnonymous() : true);

        if (dto.getQuestions() != null) {
            dto.getQuestions().forEach(qDTO -> {
                SurveyQuestion question = toQuestionEntity(qDTO);
                survey.addQuestion(question);
            });
        }
        return survey;
    }

    private SurveyQuestion toQuestionEntity(QuestionDTO dto) {
        SurveyQuestion q = new SurveyQuestion();
        q.setQuestionText(dto.getQuestionText() != null ? dto.getQuestionText().trim() : "Untitled question");
        q.setQuestionType(dto.getQuestionType());
        q.setSortOrder(dto.getSortOrder());
        q.setIsRequired(dto.getIsRequired() != null ? dto.getIsRequired() : true);

        if (dto.getOptions() != null) {
            dto.getOptions().forEach(oDTO -> {
                SurveyOption option = new SurveyOption();
                option.setOptionText(oDTO.getOptionText());
                option.setOptionValue(oDTO.getOptionValue());
                option.setSortOrder(oDTO.getSortOrder());
                q.addOption(option);
            });
        }
        return q;
    }
}
