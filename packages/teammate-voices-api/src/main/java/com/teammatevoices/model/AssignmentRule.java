package com.teammatevoices.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ASSIGNMENT_RULES")
public class AssignmentRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RULE_ID")
    private Long ruleId;

    @Column(name = "RULE_NAME", nullable = false, length = 255)
    private String ruleName;

    @Column(name = "PARTICIPANT_TYPE", nullable = false, length = 30)
    private String participantType;

    @Column(name = "SURVEY_STAGE", nullable = false, length = 30)
    private String surveyStage;

    @Column(name = "SURVEY_ID", nullable = false)
    private Long surveyId;

    @Column(name = "SEND_DAY_OFFSET")
    private Integer sendDayOffset;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    public AssignmentRule() {
    }

    public AssignmentRule(Long ruleId, String ruleName, String participantType, String surveyStage, Long surveyId, Integer sendDayOffset, Boolean isActive, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.ruleId = ruleId;
        this.ruleName = ruleName;
        this.participantType = participantType;
        this.surveyStage = surveyStage;
        this.surveyId = surveyId;
        this.sendDayOffset = sendDayOffset;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

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
