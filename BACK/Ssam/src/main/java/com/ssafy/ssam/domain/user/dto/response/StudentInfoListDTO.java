package com.ssafy.ssam.domain.user.dto.response;


import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudentInfoListDTO {
    private String name;
    private String profileImage;
}
