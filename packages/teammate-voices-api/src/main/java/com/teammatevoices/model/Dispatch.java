package com.teammatevoices.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "DISPATCHES")
public class Dispatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DISPATCH_ID")
    private Long dispatchId;

    @Column(name = "PARTICIPANT_ID", nullable = false, length = 100)
    private String participantId;

    @Column(name = "SURVEY_ID", nullable = false)
    private Long surveyId;

    @Column(name = "SURVEY_STAGE", nullable = false, length = 30)
    private String surveyStage;

    @Column(name = "DISPATCH_STATUS", length = 30)
    private String dispatchStatus = "PENDING";

    @Column(name = "SENT_AT")
    private LocalDateTime sentAt;

    @Column(name = "OPENED_AT")
    private LocalDateTime openedAt;

    @Column(name = "SUBMITTED_AT")
    private LocalDateTime submittedAt;

    @Column(name = "REMINDER_COUNT")
    private Integer reminderCount = 0;

    @Column(name = "DISPATCH_TOKEN", length = 255)
    private String dispatchToken;

    @Column(name = "LAST_REMINDER_AT")
    private LocalDateTime lastReminderAt;

    @Column(name = "MAX_REMINDERS")
    private Integer maxReminders = 3;

    @Column(name = "REMINDER_INTERVAL_DAYS")
    private Integer reminderIntervalDays = 3;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    public Dispatch() {
    }

    public Dispatch(Long dispatchId, String participantId, Long surveyId, String surveyStage, String dispatchStatus, LocalDateTime sentAt, LocalDateTime openedAt, LocalDateTime submittedAt, Integer reminderCount, String dispatchToken, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.dispatchId = dispatchId;
        this.participantId = participantId;
        this.surveyId = surveyId;
        this.surveyStage = surveyStage;
        this.dispatchStatus = dispatchStatus;
        this.sentAt = sentAt;
        this.openedAt = openedAt;
        this.submittedAt = submittedAt;
        this.reminderCount = reminderCount;
        this.dispatchToken = dispatchToken;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getDispatchId() {
        return dispatchId;
    }

    public void setDispatchId(Long dispatchId) {
        this.dispatchId = dispatchId;
    }

    public String getParticipantId() {
        return participantId;
    }

    public void setParticipantId(String participantId) {
        this.participantId = participantId;
    }

    public Long getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Long surveyId) {
        this.surveyId = surveyId;
    }

    public String getSurveyStage() {
        return surveyStage;
    }

    public void setSurveyStage(String surveyStage) {
        this.surveyStage = surveyStage;
    }

    public String getDispatchStatus() {
        return dispatchStatus;
    }

    public void setDispatchStatus(String dispatchStatus) {
        this.dispatchStatus = dispatchStatus;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public LocalDateTime getOpenedAt() {
        return openedAt;
    }

    public void setOpenedAt(LocalDateTime openedAt) {
        this.openedAt = openedAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Integer getReminderCount() {
        return reminderCount;
    }

    public void setReminderCount(Integer reminderCount) {
        this.reminderCount = reminderCount;
    }

    public String getDispatchToken() {
        return dispatchToken;
    }

    public void setDispatchToken(String dispatchToken) {
        this.dispatchToken = dispatchToken;
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

    public LocalDateTime getLastReminderAt() { return lastReminderAt; }
    public void setLastReminderAt(LocalDateTime lastReminderAt) { this.lastReminderAt = lastReminderAt; }

    public Integer getMaxReminders() { return maxReminders; }
    public void setMaxReminders(Integer maxReminders) { this.maxReminders = maxReminders; }

    public Integer getReminderIntervalDays() { return reminderIntervalDays; }
    public void setReminderIntervalDays(Integer reminderIntervalDays) { this.reminderIntervalDays = reminderIntervalDays; }
}
