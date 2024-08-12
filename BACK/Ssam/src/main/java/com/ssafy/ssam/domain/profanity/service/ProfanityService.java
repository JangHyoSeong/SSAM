package com.ssafy.ssam.domain.profanity.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ssafy.ssam.domain.profanity.dto.PredictionResultDto;

@Service
public class ProfanityService {
    private final RestTemplate restTemplate;
    private final String pythonServiceUrl = "http://i11e201.p.ssafy.io:8082/predict";

    @Autowired
    public ProfanityService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PredictionResultDto getPrediction(String message) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = "{\"sentence\":\"" + message + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        try {
            return restTemplate.postForObject(pythonServiceUrl, request, PredictionResultDto.class);
        } catch (Exception e) {
            // 예외 처리: 로깅 또는 사용자 정의 예외 throw
            e.printStackTrace();
            return new PredictionResultDto(); // 또는 null 반환 또는 사용자 정의 예외 throw
        }
    }
}