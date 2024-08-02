package com.ssafy.ssam.domain.consult.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultSummaryDTO {

    private LocalDate date;
    private Integer runningTime;
    private String consultType;

}
