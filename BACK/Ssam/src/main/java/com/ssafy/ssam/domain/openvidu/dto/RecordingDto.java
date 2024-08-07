package com.ssafy.ssam.domain.openvidu.dto;

import java.time.LocalDateTime;

import io.openvidu.java.client.Recording;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordingDto {
    private String id;
    private String sessionId;
    private String name;
    private Recording.OutputMode outputMode;
    private boolean hasAudio;
    private boolean hasVideo;
    private double duration;
    private long size;
    private Recording.Status status;
    private String url;
    private Long createdAt;

    // Getters
}