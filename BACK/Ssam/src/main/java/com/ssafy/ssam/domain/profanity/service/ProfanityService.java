package com.ssafy.ssam.domain.profanity.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ssam.domain.profanity.dto.ProfanityResponse;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProfanityService {

    private Map<String, List<String>> profanityData;

    @PostConstruct
    public void init() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream inputStream = getClass().getResourceAsStream("/json/profanity_data.json");
            profanityData = mapper.readValue(inputStream, Map.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public ProfanityResponse detectProfanity(String message) {
        Map<String, Boolean> categoryResults = new HashMap<>();

        for (Map.Entry<String, List<String>> entry : profanityData.entrySet()) {
            String category = entry.getKey();
            List<String> profanityWords = entry.getValue();

            boolean containsProfanity = profanityWords.stream()
                    .anyMatch(word -> message.toLowerCase().contains(word.toLowerCase()));

            categoryResults.put(category, containsProfanity);
        }

        return new ProfanityResponse(categoryResults);
    }
}