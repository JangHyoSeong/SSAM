package com.ssafy.ssam.domain.consult.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpcomingConsultResponseDTO {

    private Integer consultId;
    private String accessCode;
}
