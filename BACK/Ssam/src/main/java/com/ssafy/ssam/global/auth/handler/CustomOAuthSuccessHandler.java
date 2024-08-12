package com.ssafy.ssam.global.auth.handler;

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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

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
        System.out.println("providerId" + providerId);
        System.out.println("provider" + provider);
        OAuthUser linkedOAuthUser = oAuthUserRepository.findByProviderAndProviderId(provider, providerId)
                .orElse(null);

        Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
        Object principal = currentAuth.getPrincipal();

        if (linkedOAuthUser != null) {
            // 연결된 유저가 있는 경우
            System.out.println("있다");
            User user = linkedOAuthUser.getUser();
            loginUser(response, user);
        } else {


            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));

            OAuthUser newOAuthUser = new OAuthUser();
            newOAuthUser.setEmail(email);
            newOAuthUser.setProvider(provider);
            newOAuthUser.setProviderId(providerId);
            newOAuthUser.setUser(user);
            oAuthUserRepository.save(newOAuthUser);

            String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/")
                    .build().toUriString();
            response.sendRedirect(redirectUrl);
        }
    }

    private void loginUser(HttpServletResponse response, User user) throws IOException {
        System.out.println(user.getUsername());
        String token = jwtUtil.createJwt(user.getUsername(), user.getRole().name(), user.getUserId(), null, 3600000L);
        response.addHeader("Authorization", "Bearer " + token);

        // 프론트엔드 페이지로 리다이렉트 (토큰을 쿼리 파라미터로 전달)
        String redirectUrl = "http://localhost:3000" + "/auth/oauth-response/" + token;
        response.sendRedirect(redirectUrl);
    }


//    @Override
//    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
//
//        Object principal = authentication.getPrincipal();
//        String username;
//        Integer userId = null;
//        Integer boardId = null;
//
//        if (principal instanceof CustomOAuth2User) {
//            CustomOAuth2User customOAuth2User = (CustomOAuth2User) principal;
//            username = customOAuth2User.getUsername();
//            // CustomUserDetails 사용 시 추가 정보 가져오기
//            if (authentication.getPrincipal() instanceof CustomUserDetails) {
//                CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
//                userId = customUserDetails.getUserId();
//                boardId = customUserDetails.getBoardId();
//            }
//        } else if (principal instanceof DefaultOidcUser) {
//            DefaultOidcUser oidcUser = (DefaultOidcUser) principal;
//            username = oidcUser.getEmail(); // 또는 다른 적절한 메서드 사용
//            // OIDC 사용자에 대해 추가 정보 설정
//            // userId = ...
//            // boardId = ...
//        } else {
//            throw new IllegalStateException("Unexpected user type: " + principal.getClass().getName());
//        }
//
//        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
//        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
//        GrantedAuthority auth = iterator.next();
//        String role = auth.getAuthority();
//
//        String token = jwtUtil.createJwt(username, role, userId, boardId, Duration.ofHours(4).toMillis());
//        String redirectUrl = "http://localhost:3000" + "/auth/oauth-response/" + token;
//        response.addCookie(createCookie("Authorization", token));
//        response.sendRedirect(redirectUrl);
//    }
//
////    @Override
////    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
////
////        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();
////        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
////
////        String username = customOAuth2User.getUsername();
////        Integer userId = customUserDetails.getUserId();
////        Integer boardId = customUserDetails.getBoardId();
////
////        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
////        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
////        GrantedAuthority auth = iterator.next();
////        String role = auth.getAuthority();
////
////        String token = jwtUtil.createJwt(username, role, userId, boardId, Duration.ofHours(4).toMillis());
////        String redirectUrl = "http://localhost:3000" + "/auth/oauth-response/" + token;
////        response.addCookie(createCookie("Authorization", token));
////        response.sendRedirect("http://localhost:3000/");
////    }
//
//    private Cookie createCookie(String key, String value) {
//        Cookie cookie = new Cookie(key, value);
//        cookie.setMaxAge(60*60*60);
////        cookie.setSecure(true);
//        cookie.setPath("/");
//        cookie.setHttpOnly(true);
//
//        return cookie;
//    }

}
