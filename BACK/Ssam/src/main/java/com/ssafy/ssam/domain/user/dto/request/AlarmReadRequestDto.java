package com.ssafy.ssam.domain.user.dto.request;

import com.ssafy.ssam.domain.user.entity.AlarmType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class AlarmReadRequestDto {
    @NotNull
    private Integer alarmId;
}
