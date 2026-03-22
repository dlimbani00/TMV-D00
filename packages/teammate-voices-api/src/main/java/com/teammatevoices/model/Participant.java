package com.teammatevoices.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "PARTICIPANTS")
public class Participant {

    @Id
    @Column(name = "PARTICIPANT_ID", length = 100)
    private String participantId;

    @Column(name = "FULL_NAME", nullable = false, length = 255)
    private String fullName;

    @Column(name = "EMAIL", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "PARTICIPANT_TYPE", nullable = false, length = 30)
    private String participantType;

    @Column(name = "TRAINING_PROGRAM", length = 255)
    private String trainingProgram;

    @Column(name = "COHORT", length = 100)
    private String cohort;

    @Column(name = "START_DATE", nullable = false)
    private LocalDate startDate;

    @Column(name = "EXPECTED_END_DATE")
    private LocalDate expectedEndDate;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    public Participant() {
    }

    public Participant(String participantId, String fullName, String email, String participantType, String trainingProgram, String cohort, LocalDate startDate, LocalDate expectedEndDate, Boolean isActive, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.participantId = participantId;
        this.fullName = fullName;
        this.email = email;
        this.participantType = participantType;
        this.trainingProgram = trainingProgram;
        this.cohort = cohort;
        this.startDate = startDate;
        this.expectedEndDate = expectedEndDate;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getParticipantId() {
        return participantId;
    }

    public void setParticipantId(String participantId) {
        this.participantId = participantId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getParticipantType() {
        return participantType;
    }

    public void setParticipantType(String participantType) {
        this.participantType = participantType;
    }

    public String getTrainingProgram() {
        return trainingProgram;
    }

    public void setTrainingProgram(String trainingProgram) {
        this.trainingProgram = trainingProgram;
    }

    public String getCohort() {
        return cohort;
    }

    public void setCohort(String cohort) {
        this.cohort = cohort;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getExpectedEndDate() {
        return expectedEndDate;
    }

    public void setExpectedEndDate(LocalDate expectedEndDate) {
        this.expectedEndDate = expectedEndDate;
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
