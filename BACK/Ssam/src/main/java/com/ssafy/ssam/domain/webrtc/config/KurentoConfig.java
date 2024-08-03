package com.ssafy.ssam.domain.webrtc.config;

import org.kurento.client.KurentoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KurentoConfig {

    @Value("wss://i11e201.p.ssafy.io/kurento")
    private String kurentoUrl;

    @Bean
    public KurentoClient kurentoClient() {
        return KurentoClient.create(kurentoUrl);
    }
}