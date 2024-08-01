package com.ssafy.ssam.domain.user.dto.request;

import com.ssafy.ssam.domain.user.entity.AlarmType;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@RequiredArgsConstructor
public class AlarmReadRequestDto {
    @NotNull
    private Integer alarmId;
}
