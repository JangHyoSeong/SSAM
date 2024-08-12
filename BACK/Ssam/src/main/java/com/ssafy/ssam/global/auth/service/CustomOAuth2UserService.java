package com.ssafy.ssam.global.auth.service;

import com.ssafy.ssam.global.auth.entity.CustomOAuth2User;
import com.ssafy.ssam.global.auth.entity.OAuthUser;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.repository.OAuthUserRepository;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, org.springframework.security.oauth2.core.user.OAuth2User> {

    private final UserRepository userRepository;
    private final OAuthUserRepository oAuthUserRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getAttribute("sub");  // Google의 경우

        // OAuthUser 매핑
        Optional<OAuthUser> oAuthUserOpt = oAuthUserRepository.findByProviderAndProviderId(provider, providerId);
        User user;

        if (oAuthUserOpt.isPresent()) {
            // 연동된 유저 계정이 있다면, 해당 유저로 로그인 처리
            user = oAuthUserOpt.get().getUser();
        } else {
            throw new OAuth2AuthenticationException("No user linked with this Google account.");
        }
        return new CustomOAuth2User(user, oAuth2User.getAttributes());
    }

    public void linkUserWithOAuth2Account(User user, OAuth2User oAuth2User, String provider, String providerId) {
        // 새로운 OAuthUser 엔티티 생성 및 저장
        OAuthUser oAuthUser = OAuthUser.builder()
                .provider(provider)
                .providerId(providerId)
                .user(user)
                .build();

        oAuthUserRepository.save(oAuthUser);
    }

}
