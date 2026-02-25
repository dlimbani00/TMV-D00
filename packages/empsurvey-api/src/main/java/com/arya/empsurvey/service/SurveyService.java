package com.arya.empsurvey.service;

import com.arya.empsurvey.dto.OptionDTO;
import com.arya.empsurvey.dto.QuestionDTO;
import com.arya.empsurvey.dto.SurveyDTO;
import com.arya.empsurvey.model.Survey;
import com.arya.empsurvey.model.SurveyOption;
import com.arya.empsurvey.model.SurveyQuestion;
import com.arya.empsurvey.repository.SurveyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SurveyService {

    private final SurveyRepository surveyRepository;

    @Transactional(readOnly = true)
    public List<SurveyDTO> getAllSurveys() {
        log.info("Fetching all surveys");
        return surveyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SurveyDTO getSurveyById(Long id) {
        log.info("Fetching survey with id: {}", id);
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found with id: " + id));
        return convertToDTO(survey);
    }

    @Transactional
    public SurveyDTO createSurvey(SurveyDTO surveyDTO) {
        log.info("Creating new survey: {}", surveyDTO.getTitle());
        Survey survey = convertToEntity(surveyDTO);
        Survey savedSurvey = surveyRepository.save(survey);
        return convertToDTO(savedSurvey);
    }

    @Transactional
    public SurveyDTO updateSurvey(Long id, SurveyDTO surveyDTO) {
        log.info("Updating survey with id: {}", id);
        Survey existingSurvey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found with id: " + id));

        // Update basic fields
        existingSurvey.setTitle(surveyDTO.getTitle());
        existingSurvey.setDescription(surveyDTO.getDescription());
        existingSurvey.setTemplateType(surveyDTO.getTemplateType());
        existingSurvey.setStatus(surveyDTO.getStatus());
        existingSurvey.setStartDate(surveyDTO.getStartDate());
        existingSurvey.setEndDate(surveyDTO.getEndDate());
        existingSurvey.setIsAnonymous(surveyDTO.getIsAnonymous());

        // Update questions
        existingSurvey.getQuestions().clear();
        if (surveyDTO.getQuestions() != null) {
            surveyDTO.getQuestions().forEach(qDTO -> {
                SurveyQuestion question = convertQuestionToEntity(qDTO);
                existingSurvey.addQuestion(question);
            });
        }

        Survey updatedSurvey = surveyRepository.save(existingSurvey);
        return convertToDTO(updatedSurvey);
    }

    @Transactional
    public void deleteSurvey(Long id) {
        log.info("Deleting survey with id: {}", id);
        if (!surveyRepository.existsById(id)) {
            throw new RuntimeException("Survey not found with id: " + id);
        }
        surveyRepository.deleteById(id);
    }

    @Transactional
    public SurveyDTO publishSurvey(Long id) {
        log.info("Publishing survey with id: {}", id);
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found with id: " + id));
        survey.setStatus("ACTIVE");
        Survey published = surveyRepository.save(survey);
        return convertToDTO(published);
    }

    // Conversion methods
    private SurveyDTO convertToDTO(Survey survey) {
        SurveyDTO dto = new SurveyDTO();
        dto.setSurveyId(survey.getSurveyId());
        dto.setTitle(survey.getTitle());
        dto.setDescription(survey.getDescription());
        dto.setTemplateType(survey.getTemplateType());
        dto.setStatus(survey.getStatus());
        dto.setCreatedBy(survey.getCreatedBy());
        dto.setCreatedAt(survey.getCreatedAt());
        dto.setUpdatedAt(survey.getUpdatedAt());
        dto.setStartDate(survey.getStartDate());
        dto.setEndDate(survey.getEndDate());
        dto.setIsAnonymous(survey.getIsAnonymous());
        
        if (survey.getQuestions() != null) {
            dto.setQuestions(survey.getQuestions().stream()
                    .map(this::convertQuestionToDTO)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    private QuestionDTO convertQuestionToDTO(SurveyQuestion question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setQuestionId(question.getQuestionId());
        dto.setQuestionText(question.getQuestionText());
        dto.setQuestionType(question.getQuestionType());
        dto.setSortOrder(question.getSortOrder());
        dto.setIsRequired(question.getIsRequired());
        
        if (question.getOptions() != null) {
            dto.setOptions(question.getOptions().stream()
                    .map(this::convertOptionToDTO)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    private OptionDTO convertOptionToDTO(SurveyOption option) {
        OptionDTO dto = new OptionDTO();
        dto.setOptionId(option.getOptionId());
        dto.setOptionText(option.getOptionText());
        dto.setOptionValue(option.getOptionValue());
        dto.setSortOrder(option.getSortOrder());
        return dto;
    }

    private Survey convertToEntity(SurveyDTO dto) {
        Survey survey = new Survey();
        survey.setTitle(dto.getTitle());
        survey.setDescription(dto.getDescription());
        survey.setTemplateType(dto.getTemplateType());
        survey.setStatus(dto.getStatus() != null ? dto.getStatus() : "DRAFT");
        survey.setStartDate(dto.getStartDate());
        survey.setEndDate(dto.getEndDate());
        survey.setIsAnonymous(dto.getIsAnonymous() != null ? dto.getIsAnonymous() : false);
        
        if (dto.getQuestions() != null) {
            dto.getQuestions().forEach(qDTO -> {
                SurveyQuestion question = convertQuestionToEntity(qDTO);
                survey.addQuestion(question);
            });
        }
        
        return survey;
    }

    private SurveyQuestion convertQuestionToEntity(QuestionDTO dto) {
        SurveyQuestion question = new SurveyQuestion();
        question.setQuestionText(normalizeQuestionText(dto.getQuestionText()));
        question.setQuestionType(dto.getQuestionType());
        question.setSortOrder(dto.getSortOrder());
        question.setIsRequired(dto.getIsRequired() != null ? dto.getIsRequired() : true);
        
        if (dto.getOptions() != null) {
            dto.getOptions().forEach(oDTO -> {
                SurveyOption option = convertOptionToEntity(oDTO);
                question.addOption(option);
            });
        }
        
        return question;
    }

    private String normalizeQuestionText(String questionText) {
        if (questionText == null || questionText.trim().isEmpty()) {
            return "Untitled question";
        }
        return questionText.trim();
    }

    private SurveyOption convertOptionToEntity(OptionDTO dto) {
        SurveyOption option = new SurveyOption();
        option.setOptionText(dto.getOptionText());
        option.setOptionValue(dto.getOptionValue());
        option.setSortOrder(dto.getSortOrder());
        return option;
    }
}
