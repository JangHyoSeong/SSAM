package com.ssafy.ssam.domain.webrtc.config;

import org.kurento.client.KurentoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

import com.ssafy.ssam.domain.webrtc.controller.ConsultationController;

@Configuration
@EnableWebSocket
public class KurentoConfig implements WebSocketConfigurer {

    @Value("${kurento.client.url:wss://i11e201.p.ssafy.io/kurento}")
    private String kurentoUrl;

    @Value("${turn.server.url:i11e201.p.ssafy.io:3478}")
    private String turnServerUrl;

    @Value("${turn.server.username:admin}")
    private String turnServerUsername;

    @Value("${turn.server.credential:JddU_RuEn5Iqc}")
    private String turnServerCredential;

    @Bean
    public KurentoClient kurentoClient() {
        String kurentoUrlWithTurn = kurentoUrl + "?turnURL=" + turnServerUrl +
                "&turnUsername=" + turnServerUsername +
                "&turnPassword=" + turnServerCredential;
        return KurentoClient.create(kurentoUrlWithTurn);
    }

    @Bean
    public ConsultationController consultationController() {
        return new ConsultationController();
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(32768);
        container.setMaxBinaryMessageBufferSize(32768);
        return container;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(consultationController(), "/v1/kurento")
                .setAllowedOrigins("http://localhost:5173", "https://i11e201.p.ssafy.io");
    }
}