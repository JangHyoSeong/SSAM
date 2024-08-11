package com.ssafy.ssam.global.auth.service;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Optional;

import com.ssafy.ssam.global.auth.dto.request.GoogleAccountLinkRequest;
import com.ssafy.ssam.global.auth.dto.request.JoinRequestDto;
import com.ssafy.ssam.global.auth.entity.OAuthUser;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.entity.UserRole;
import com.ssafy.ssam.global.auth.jwt.JwtUtil;
import com.ssafy.ssam.global.auth.repository.OAuthUserRepository;
import com.ssafy.ssam.global.error.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ssam.domain.user.dto.response.UserDto;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.ErrorCode;
import com.ssafy.ssam.global.error.exception.DuplicateUserNameException;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Builder
@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final OAuthUserRepository oAuthUserRepository;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtUtil jwtUtil;

    public CommonResponseDto teacherJoinProcess(JoinRequestDto userDto){
        if(userRepository.existsByUsername(userDto.getUsername())) throw new DuplicateUserNameException(ErrorCode.DuplicateUserName);
        User user = User.JoinRequestToUser(userDto);
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        user.setRole(UserRole.TEACHER);
        userRepository.save(user);

        return new CommonResponseDto("OK");
    }

    public CommonResponseDto studentJoinProcess(JoinRequestDto userDto){
        if(userRepository.existsByUsername(userDto.getUsername())) throw new DuplicateUserNameException(ErrorCode.DuplicateUserName);
        User user = User.JoinRequestToUser(userDto);
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        user.setRole(UserRole.STUDENT);
        userRepository.save(user);

        return new CommonResponseDto("OK");
    }
//
//    public CommonResponseDto linkGoogleAccount(Principal principal, OAuth2AuthenticationToken authenticationToken) {
//
////        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String username = principal.getName();
//        User user = userRepository.findByUsername(username).orElseThrow(()->new CustomException(ErrorCode.UserNotFoundException));
//
//        // 구글 계정과 연동된 유저가 없는지 확인
//        String provider = authenticationToken.getAuthorizedClientRegistrationId();
//        OAuth2User oAuth2User = (OAuth2User) authenticationToken.getPrincipal();
//        String providerId = oAuth2User.getAttribute("sub");
//
//        if (oAuthUserRepository.findByProviderAndProviderId(provider, providerId).isPresent()) {
//            throw new ResponseStatusException(HttpStatus.CONFLICT, "Google account already linked with another user");
//        }
//
//        customOAuth2UserService.linkUserWithOAuth2Account(user, oAuth2User, provider, providerId);
//        return new CommonResponseDto("Link Success");
//    }
//
//    public CommonResponseDto linkGoogleAccount(String token) {
//        // 1. JWT 토큰에서 사용자 정보 추출
//        String username = jwtUtil.getUsername(token);
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
//
//        // 2. 현재 인증된 OAuth2 사용자 정보 가져오기
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        OAuth2User oauth2User = null;
//        String provider = null;
//        String providerId = null;
//
//        if (authentication instanceof OAuth2AuthenticationToken) {
//            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
//            oauth2User = oauthToken.getPrincipal();
//            provider = oauthToken.getAuthorizedClientRegistrationId();
//            providerId = oauth2User.getAttribute("sub");
//        } else {
//            // JWT 토큰으로 인증된 경우, Google 계정 정보를 다른 방식으로 가져와야 합니다.
//            // 예를 들어, 파라미터로 전달받거나, 별도의 API 호출을 통해 가져올 수 있습니다.
//            provider = "google";  // 예시
//            providerId = "googleProviderId";  // 이 값을 어떻게 얻을지 결정해야 합니다.
//        }
//
//        if (provider == null || providerId == null) {
//            throw new CustomException(ErrorCode.InvalidAuthenticationException);
//        }
//
//        // 4. 이미 연결된 계정인지 확인
//        Optional<OAuthUser> existingOAuth2User = oAuthUserRepository.findByProviderAndProviderId(provider, providerId);
//        if (existingOAuth2User.isPresent()) {
//            throw new CustomException(ErrorCode.OAuth2AccountAlreadyLinked);
//        }
//
//        // 5. 새로운 OAuth2User 엔티티 생성 및 저장
//        OAuthUser newOAuthUser = new OAuthUser();
//        newOAuthUser.setUser(user);
//        newOAuthUser.setProvider(provider);
//        newOAuthUser.setProviderId(providerId);
//
//        oAuthUserRepository.save(newOAuthUser);
//
//
//        return new CommonResponseDto("Google account successfully linked");
//    }
//
//    public CommonResponseDto linkGoogleAccount(GoogleAccountLinkRequest request, String token) {
//        String username = jwtUtil.getUsername(token.replace("Bearer ", ""));
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
//
//        // 이미 연결된 계정이 있는지 확인
//        if (oAuthUserRepository.findByProviderAndProviderId(request.getProvider(), request.getProviderId()).isPresent()) {
//            throw new CustomException(ErrorCode.OAuth2AccountAlreadyLinked);
//        }
//
//        OAuthUser oAuthUser = new OAuthUser();
//        oAuthUser.setUser(user);
//        oAuthUser.setProvider(request.getProvider());
//        oAuthUser.setProviderId(request.getProviderId());
//        oAuthUser.setEmail(request.getEmail());
//
//        oAuthUserRepository.save(oAuthUser);
//
//        return new CommonResponseDto("Google account linked successfully");
//    }

	public CommonResponseDto userGenProcess() {
		
        // Admin 사용자 생성
        UserDto admin = new UserDto();
        admin.setUsername("admin1");
        admin.setPassword(bCryptPasswordEncoder.encode("1234"));
        admin.setName("Admin User");
        admin.setEmail("admin@example.com");
        admin.setPhone("01012345678");
        admin.setRole(UserRole.ADMIN);
        admin.setBirth(LocalDate.of(2000, 1, 1));
        userRepository.save(User.toUser(admin));
        
        // Teacher 사용자 생성
        UserDto teacher = new UserDto();
        teacher.setUsername("teacher1");
        teacher.setPassword(bCryptPasswordEncoder.encode("1234"));
        teacher.setName("Teacher User");
        teacher.setEmail("teacher@example.com");
        teacher.setPhone("01023456789");
        teacher.setRole(UserRole.TEACHER);
        teacher.setBirth(LocalDate.of(1990, 1, 1));
        userRepository.save(User.toUser(teacher));
        
        // Student 사용자들 생성
        for (int i = 1; i <= 20; i++) {
            UserDto student = new UserDto();
            student.setUsername("student" + i);
            student.setPassword(bCryptPasswordEncoder.encode("1234"));
            student.setName("Student " + i);
            student.setEmail("student" + i + "@example.com");
            student.setPhone("010" + String.format("%08d", i));
            student.setRole(UserRole.STUDENT);
            student.setBirth(LocalDate.of(2005, 1, 1).plusDays(i - 1));
            userRepository.save(User.toUser(student));
        }
		
		return new CommonResponseDto("OK");
	}
}
