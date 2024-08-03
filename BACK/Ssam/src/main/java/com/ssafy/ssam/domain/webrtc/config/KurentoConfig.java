package com.ssafy.ssam.domain.webrtc.config;

import org.kurento.client.KurentoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KurentoConfig {

    @Value("ws://i11e201.p.ssafy.io:8888/kurento")
    //@Value("ws://host.docker.internal:8888/kurento")
    private String kurentoUrl;

    @Bean
    public KurentoClient kurentoClient() {
        return KurentoClient.create(kurentoUrl);
    }
}