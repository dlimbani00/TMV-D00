package com.teammatevoices.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "SURVEY_OPTIONS")
public class SurveyOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OPTION_ID")
    private Long optionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QUESTION_ID", nullable = false)
    private SurveyQuestion question;

    @Column(name = "OPTION_TEXT", nullable = false, length = 255)
    private String optionText;

    @Column(name = "OPTION_VALUE")
    private Integer optionValue;

    @Column(name = "SORT_ORDER")
    private Integer sortOrder = 0;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    public SurveyOption() {
    }

    public SurveyOption(Long optionId, SurveyQuestion question, String optionText, Integer optionValue, Integer sortOrder, LocalDateTime createdAt) {
        this.optionId = optionId;
        this.question = question;
        this.optionText = optionText;
        this.optionValue = optionValue;
        this.sortOrder = sortOrder;
        this.createdAt = createdAt;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public SurveyQuestion getQuestion() {
        return question;
    }

    public void setQuestion(SurveyQuestion question) {
        this.question = question;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public Integer getOptionValue() {
        return optionValue;
    }

    public void setOptionValue(Integer optionValue) {
        this.optionValue = optionValue;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
