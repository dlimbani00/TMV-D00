package com.teammatevoices.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "PROGRAMS")
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PROGRAM_ID")
    private Long programId;

    @Column(name = "NAME", nullable = false, length = 255)
    private String name;

    @Column(name = "DESCRIPTION")
    @Lob
    private String description;

    @Column(name = "TEMPLATE_TYPE", length = 50)
    private String templateType = "CUSTOM";

    @Column(name = "STATUS", nullable = false, length = 20)
    private String status = "INACTIVE";

    @Column(name = "SURVEY_PROGRESS", nullable = false, length = 30)
    private String surveyProgress = "NOT_STARTED";

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    public Program() {
    }

    public Program(Long programId, String name, String description, String templateType, String status, String surveyProgress, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.programId = programId;
        this.name = name;
        this.description = description;
        this.templateType = templateType;
        this.status = status;
        this.surveyProgress = surveyProgress;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getSurveyProgress() {
        return surveyProgress;
    }

    public void setSurveyProgress(String surveyProgress) {
        this.surveyProgress = surveyProgress;
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
