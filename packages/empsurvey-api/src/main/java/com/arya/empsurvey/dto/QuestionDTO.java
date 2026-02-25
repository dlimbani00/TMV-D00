package com.arya.empsurvey.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    private Long questionId;
    private String questionText;
    private String questionType;
    private Integer sortOrder;
    private Boolean isRequired;
    private List<OptionDTO> options = new ArrayList<>();
}
