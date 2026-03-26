package com.teammatevoices.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "SURVEYS")
public class Survey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SURVEY_ID")
    private Long surveyId;

    @Column(name = "TITLE", nullable = false, length = 255)
    private String title;

    @Column(name = "DESCRIPTION")
    @Lob
    private String description;

    @Column(name = "TEMPLATE_TYPE", nullable = false, length = 50)
    private String templateType = "CUSTOM";

    @Column(name = "STATUS", nullable = false, length = 20)
    private String status = "DRAFT";

    @Column(name = "BUILD_STATUS", nullable = false, length = 20)
    private String buildStatus = "DRAFT";

    @Column(name = "PROGRAM_ID")
    private Long programId;

    @Column(name = "CYCLE", length = 100)
    private String cycle;

    @Lob
    @Column(name = "PAGES")
    private String pages;

    @Lob
    @Column(name = "LOGIC_JSON")
    private String logicJson;

    @Column(name = "PARTICIPANT_TYPE", length = 30)
    private String participantType = "ALL";

    @Column(name = "SURVEY_STAGE", length = 30)
    private String surveyStage = "ONBOARDING";

    @Column(name = "AUDIENCE_SOURCE", length = 30)
    private String audienceSource = "CSV_UPLOAD";

    @Column(name = "AUTO_SEND")
    private Boolean autoSend = false;

    @Column(name = "CREATED_BY")
    private Long createdBy;

    @Column(name = "START_DATE")
    private LocalDate startDate;

    @Column(name = "END_DATE")
    private LocalDate endDate;

    @Column(name = "IS_ANONYMOUS")
    private Boolean isAnonymous = true;

    @Column(name = "FREQUENCY", length = 20)
    private String frequency;

    @Column(name = "NEXT_SCHEDULED_AT")
    private LocalDateTime nextScheduledAt;

    @Column(name = "PARENT_SURVEY_ID")
    private Long parentSurveyId;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SurveyQuestion> questions = new ArrayList<>();

    public Survey() {
    }

    public Survey(Long surveyId, String title, String description, String templateType, String status, String participantType, String surveyStage, String audienceSource, Boolean autoSend, Long createdBy, LocalDate startDate, LocalDate endDate, Boolean isAnonymous, LocalDateTime createdAt, LocalDateTime updatedAt, List<SurveyQuestion> questions) {
        this.surveyId = surveyId;
        this.title = title;
        this.description = description;
        this.templateType = templateType;
        this.status = status;
        this.participantType = participantType;
        this.surveyStage = surveyStage;
        this.audienceSource = audienceSource;
        this.autoSend = autoSend;
        this.createdBy = createdBy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isAnonymous = isAnonymous;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.questions = questions;
    }

    public void addQuestion(SurveyQuestion question) {
        questions.add(question);
        question.setSurvey(this);
    }

    public void removeQuestion(SurveyQuestion question) {
        questions.remove(question);
        question.setSurvey(null);
    }

    public Long getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Long surveyId) {
        this.surveyId = surveyId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTemplateType() {
        return templateType;
    }

    public void setTemplateType(String templateType) {
        this.templateType = templateType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getAudienceSource() {
        return audienceSource;
    }

    public void setAudienceSource(String audienceSource) {
        this.audienceSource = audienceSource;
    }

    public Boolean getAutoSend() {
        return autoSend;
    }

    public void setAutoSend(Boolean autoSend) {
        this.autoSend = autoSend;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
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

    public String getBuildStatus() {
        return buildStatus;
    }

    public void setBuildStatus(String buildStatus) {
        this.buildStatus = buildStatus;
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public String getCycle() {
        return cycle;
    }

    public void setCycle(String cycle) {
        this.cycle = cycle;
    }

    public String getPages() {
        return pages;
    }

    public void setPages(String pages) {
        this.pages = pages;
    }

    public String getLogicJson() {
        return logicJson;
    }

    public void setLogicJson(String logicJson) {
        this.logicJson = logicJson;
    }

    public List<SurveyQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<SurveyQuestion> questions) {
        this.questions = questions;
    }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public LocalDateTime getNextScheduledAt() { return nextScheduledAt; }
    public void setNextScheduledAt(LocalDateTime nextScheduledAt) { this.nextScheduledAt = nextScheduledAt; }

    public Long getParentSurveyId() { return parentSurveyId; }
    public void setParentSurveyId(Long parentSurveyId) { this.parentSurveyId = parentSurveyId; }
}
