package com.ssafy.ssam.domain.user.service;

import com.ssafy.ssam.domain.user.dto.response.UserInitialInfoResponseDTO;
import com.ssafy.ssam.domain.classroom.repository.SchoolRepository;
import com.ssafy.ssam.domain.user.dto.request.UserInfoModificationRequestDTO;
import com.ssafy.ssam.domain.user.dto.response.UserInfoResponseDTO;
import com.ssafy.ssam.global.amazonS3.service.S3ImageService;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.domain.classroom.entity.School;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserInfoService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final S3ImageService s3ImageService;


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

    // 사용자 정보 수정 로직
    public CommonResponseDto modificateUserInfo (UserInfoModificationRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));

        String schoolName = requestDTO.getSchool();
        String selfPhone = requestDTO.getSelfPhone();
        String otherPhone = requestDTO.getOtherPhone();
        MultipartFile profileImage = requestDTO.getProfileImage();

        user.setSchool(schoolRepository.findSchoolByName(schoolName).orElse(null));
        user.setPhone(selfPhone);
        user.setOtherPhone(requestDTO.getOtherPhone());
        if (profileImage != null && !profileImage.isEmpty()) {
            String imagePath = s3ImageService.upload(profileImage);
            user.setImgUrl(imagePath);
        }

        userRepository.save(user);

        return new CommonResponseDto("Modificated");
    }

    public UserInitialInfoResponseDTO getInitialInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.Unauthorized));

        return UserInitialInfoResponseDTO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .name(user.getName())
                .boardId(userDetails.getBoardId())
                .role(String.valueOf(user.getRole()))
                .school(Optional.ofNullable(user.getSchool()).map(School::getName).orElse(null))
                .build();
    }

}
