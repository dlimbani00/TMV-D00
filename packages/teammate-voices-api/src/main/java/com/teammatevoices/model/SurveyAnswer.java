package com.teammatevoices.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "SURVEY_ANSWERS")
public class SurveyAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ANSWER_ID")
    private Long answerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RESPONSE_ID", nullable = false)
    private SurveyResponse response;

    @Column(name = "QUESTION_ID", nullable = false)
    private Long questionId;

    @Column(name = "ANSWER_TEXT")
    @Lob
    private String answerText;

    @Column(name = "ANSWER_VALUE")
    private Integer answerValue;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    public SurveyAnswer() {
    }

    public SurveyAnswer(Long answerId, SurveyResponse response, Long questionId, String answerText, Integer answerValue, LocalDateTime createdAt) {
        this.answerId = answerId;
        this.response = response;
        this.questionId = questionId;
        this.answerText = answerText;
        this.answerValue = answerValue;
        this.createdAt = createdAt;
    }

    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }

    public SurveyResponse getResponse() {
        return response;
    }

    public void setResponse(SurveyResponse response) {
        this.response = response;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public Integer getAnswerValue() {
        return answerValue;
    }

    public void setAnswerValue(Integer answerValue) {
        this.answerValue = answerValue;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
