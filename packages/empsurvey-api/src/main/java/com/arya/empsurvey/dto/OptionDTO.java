package com.arya.empsurvey.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OptionDTO {
    private Long optionId;
    private String optionText;
    private Integer optionValue;
    private Integer sortOrder;
}
