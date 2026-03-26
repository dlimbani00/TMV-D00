package com.teammatevoices.repository;

import com.teammatevoices.model.SurveyAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyAnswerRepository extends JpaRepository<SurveyAnswer, Long> {
    List<SurveyAnswer> findByResponse_ResponseId(Long responseId);

    /** Load all answers for a survey in one query (joins through Response → Survey) */
    List<SurveyAnswer> findByResponse_Survey_SurveyId(Long surveyId);
}
