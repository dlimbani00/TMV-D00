package com.arya.empsurvey.repository;

import com.arya.empsurvey.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    
    List<Survey> findByStatus(String status);
    
    List<Survey> findByTemplateType(String templateType);
    
    @Query("SELECT s FROM Survey s WHERE s.status = 'ACTIVE' ORDER BY s.createdAt DESC")
    List<Survey> findActiveSurveys();
    
    @Query("SELECT s FROM Survey s LEFT JOIN FETCH s.questions WHERE s.surveyId = :surveyId")
    Survey findByIdWithQuestions(Long surveyId);
}
