package com.ssafy.ssam.domain.profanity.dto;

import java.util.Map;

public class ProfanityResponse {
    private Map<String, Boolean> categoryResults;

    public ProfanityResponse(Map<String, Boolean> categoryResults) {
        this.categoryResults = categoryResults;
    }

    public Map<String, Boolean> getCategoryResults() {
        return categoryResults;
    }
}