package com.ssafy.ssam.classroom.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BoardCreateRequestDTO {

    @NotNull
    @Min(1)
    @Max(6)
    private int grade;

    @NotNull
    private int classroom;
}
