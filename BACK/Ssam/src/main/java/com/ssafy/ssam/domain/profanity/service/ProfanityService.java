//package com.ssafy.ssam.domain.profanity.service;
//
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//@Service
//public class ProfanityService {
//    private final RestTemplate restTemplate;
//    private final String pythonServiceUrl = "http://localhost:8082/predict";
//
//    public PredictionResult getPrediction(String sentence) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        HttpEntity<String> request = new HttpEntity<>("{\"sentence\":\"" + sentence + "\"}", headers);
//
//        return restTemplate.postForObject(pythonServiceUrl, request, PredictionResult.class);
//    }
//}
//
//public class PredictionResult {
//    private String Default;
//    private String Offensive;
//    private String Hate;
//    private String Category;
//
//    // Getters and setters
//}