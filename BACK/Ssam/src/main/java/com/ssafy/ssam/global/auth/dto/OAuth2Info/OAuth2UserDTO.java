package com.ssafy.ssam.global.auth.dto.OAuth2Info;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OAuth2UserDTO {
    private String role;
    private String name;
    private String username;
}
