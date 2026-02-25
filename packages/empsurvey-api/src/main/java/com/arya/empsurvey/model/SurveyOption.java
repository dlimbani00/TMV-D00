package com.arya.empsurvey.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "SURVEY_OPTIONS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OPTION_ID")
    private Long optionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QUESTION_ID", nullable = false)
    @JsonIgnore
    private SurveyQuestion question;

    @Column(name = "OPTION_TEXT", length = 255)
    private String optionText;

    @Column(name = "OPTION_VALUE")
    private Integer optionValue;

    @Column(name = "SORT_ORDER")
    private Integer sortOrder;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;
}
