package com.ssafy.ssam.domain.user.service;

import com.ssafy.ssam.domain.user.dto.response.UserInfoResponseDTO;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.domain.classroom.entity.School;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserInfoService {

    private final UserRepository userRepository;


    // 사용자 상세 정보 제공 로직
    public UserInfoResponseDTO getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));

        return UserInfoResponseDTO.builder()
                .name(user.getName())
                .profileImage(user.getImgUrl())
                .birth(user.getBirth())
                .school(Optional.ofNullable(user.getSchool()).map(School::getName).orElse(null))
                .username(user.getUsername())
                .email(user.getEmail())
                .selfPhone(user.getPhone())
                .otherPhone(user.getOtherPhone())
                .build();
    }

}
