package com.ssafy.ssam.global.auth.dto.OAuth2Info;



import lombok.Getter;

import java.util.Map;

@Getter
public abstract class OAuth2UserInfo {
    protected Map<String, Object> attributes;

    public OAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public abstract String getProviderId();
    public abstract String getEmail();
    public abstract String getName();
}
