package com.ssafy.ssam.global.auth.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.OAuthUser;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.jwt.JwtUtil;
import com.ssafy.ssam.global.auth.repository.OAuthUserRepository;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.hibernate.CustomEntityDirtinessStrategy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@RequiredArgsConstructor
@Component
public class CustomOAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final OAuthUserRepository oAuthUserRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String providerId = oAuth2User.getAttribute("sub");
        String provider = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();


        // state 파라미터에서 원래 사용자 ID 추출
//        String state = request.getParameter("state");
//        Integer userId = extractUserIdFromState(state);

        OAuthUser linkedOAuthUser = oAuthUserRepository.findByProviderAndProviderId(provider, providerId)
                .orElse(null);

        if (linkedOAuthUser != null) {
            // 이미 연결된 계정이 있는 경우
            User user = linkedOAuthUser.getUser();
            loginUser(response, user);
        } else {
            // 현재 로그인된 사용자와 OAuth 계정 연결
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));

            OAuthUser newOAuthUser = new OAuthUser();
            newOAuthUser.setEmail(email);
            newOAuthUser.setProvider(provider);
            newOAuthUser.setProviderId(providerId);
            newOAuthUser.setUser(user);
            oAuthUserRepository.save(newOAuthUser);

            String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/account-linked")
                    .build().toUriString();
            response.sendRedirect(redirectUrl);
        }
//        else {
//            // 연결할 계정이 없는 경우
//            String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/login")
//                    .queryParam("error", "No linked account found")
//                    .build().toUriString();
//            response.sendRedirect(redirectUrl);
//        }
    }

    private Integer extractUserIdFromState(String state) {
        try {
            if (state != null) {
                // URL 디코딩 후 Base64 디코딩
                System.out.println(state);
                String decodedState = new String(Base64.getDecoder().decode(URLDecoder.decode(state, StandardCharsets.UTF_8)));
                System.out.println(decodedState);
                JsonNode jsonNode = new ObjectMapper().readTree(decodedState);
                return jsonNode.get("userId").asInt();
            }
        } catch (Exception e) {
            logger.error("Error decoding state: ", e);
        }
        return null;
    }

    private void loginUser(HttpServletResponse response, User user) throws IOException {
        String token = jwtUtil.createJwt(user.getUsername(), user.getRole().name(), user.getUserId(), null, 3600000L);
        String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/auth/oauth-response/" + token)
                .build().toUriString();
        response.sendRedirect(redirectUrl);
    }

}
