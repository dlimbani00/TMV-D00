package com.arya.empsurvey.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "SURVEY_QUESTIONS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "QUESTION_ID")
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SURVEY_ID", nullable = false)
    @JsonIgnore
    private Survey survey;

    @Column(name = "QUESTION_TEXT", nullable = false, length = 500)
    private String questionText;

    @Column(name = "QUESTION_TYPE", nullable = false, length = 30)
    private String questionType;

    @Column(name = "SORT_ORDER")
    private Integer sortOrder;

    @Column(name = "IS_REQUIRED")
    private Boolean isRequired = true;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SurveyOption> options = new ArrayList<>();

    // Helper methods
    public void addOption(SurveyOption option) {
        options.add(option);
        option.setQuestion(this);
    }

    public void removeOption(SurveyOption option) {
        options.remove(option);
        option.setQuestion(null);
    }
}
