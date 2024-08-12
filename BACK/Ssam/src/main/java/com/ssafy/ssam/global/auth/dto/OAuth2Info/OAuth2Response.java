package com.ssafy.ssam.global.auth.dto.OAuth2Info;

public interface OAuth2Response {
    String getProvider();
    String getProviderId();
    String getEmail();
    String getName();
}
