package com.teammatevoices.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class AssignmentRuleDTO {
    private Long ruleId;

    @NotBlank(message = "Rule name is required")
    private String ruleName;

    @NotBlank(message = "Participant type is required")
    private String participantType;

    @NotBlank(message = "Survey stage is required")
    private String surveyStage;

    @NotNull(message = "Survey ID is required")
    private Long surveyId;

    private Integer sendDayOffset;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getRuleId() {
        return ruleId;
    }

    public void setRuleId(Long ruleId) {
        this.ruleId = ruleId;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public String getParticipantType() {
        return participantType;
    }

    public void setParticipantType(String participantType) {
        this.participantType = participantType;
    }

    public String getSurveyStage() {
        return surveyStage;
    }

    public void setSurveyStage(String surveyStage) {
        this.surveyStage = surveyStage;
    }

    public Long getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Long surveyId) {
        this.surveyId = surveyId;
    }

    public Integer getSendDayOffset() {
        return sendDayOffset;
    }

    public void setSendDayOffset(Integer sendDayOffset) {
        this.sendDayOffset = sendDayOffset;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
