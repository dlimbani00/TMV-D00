package com.teammatevoices.service;

import com.teammatevoices.dto.AssignmentRuleDTO;
import com.teammatevoices.exception.ResourceNotFoundException;
import com.teammatevoices.model.AssignmentRule;
import com.teammatevoices.repository.AssignmentRuleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentRuleService {

    private static final Logger log = LoggerFactory.getLogger(AssignmentRuleService.class);

    private final AssignmentRuleRepository ruleRepository;

    public AssignmentRuleService(AssignmentRuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    @Transactional(readOnly = true)
    public List<AssignmentRuleDTO> getAllRules() {
        return ruleRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AssignmentRuleDTO createRule(AssignmentRuleDTO dto) {
        log.info("Creating assignment rule: {}", dto.getRuleName());
        AssignmentRule rule = toEntity(dto);
        return toDTO(ruleRepository.save(rule));
    }

    @Transactional
    public AssignmentRuleDTO updateRule(Long id, AssignmentRuleDTO dto) {
        AssignmentRule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AssignmentRule", id));
        rule.setRuleName(dto.getRuleName());
        rule.setParticipantType(dto.getParticipantType());
        rule.setSurveyStage(dto.getSurveyStage());
        rule.setSurveyId(dto.getSurveyId());
        rule.setSendDayOffset(dto.getSendDayOffset());
        rule.setIsActive(dto.getIsActive());
        return toDTO(ruleRepository.save(rule));
    }

    @Transactional
    public void deleteRule(Long id) {
        if (!ruleRepository.existsById(id)) {
            throw new ResourceNotFoundException("AssignmentRule", id);
        }
        ruleRepository.deleteById(id);
    }

    private AssignmentRuleDTO toDTO(AssignmentRule r) {
        AssignmentRuleDTO dto = new AssignmentRuleDTO();
        dto.setRuleId(r.getRuleId());
        dto.setRuleName(r.getRuleName());
        dto.setParticipantType(r.getParticipantType());
        dto.setSurveyStage(r.getSurveyStage());
        dto.setSurveyId(r.getSurveyId());
        dto.setSendDayOffset(r.getSendDayOffset());
        dto.setIsActive(r.getIsActive());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }

    private AssignmentRule toEntity(AssignmentRuleDTO dto) {
        AssignmentRule r = new AssignmentRule();
        r.setRuleName(dto.getRuleName());
        r.setParticipantType(dto.getParticipantType());
        r.setSurveyStage(dto.getSurveyStage());
        r.setSurveyId(dto.getSurveyId());
        r.setSendDayOffset(dto.getSendDayOffset());
        r.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        return r;
    }
}
