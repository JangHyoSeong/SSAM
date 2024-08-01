package com.ssafy.ssam.domain.user.service;

import com.ssafy.ssam.domain.user.dto.response.StudentRegistInfoDTO;
import com.ssafy.ssam.domain.user.entity.UserBoardRelation;
import com.ssafy.ssam.domain.user.entity.UserBoardRelationStatus;
import com.ssafy.ssam.domain.user.repository.UserBoardRelationRepository;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserBoardRelationService {

    private final UserRepository userRepository;
    private final UserBoardRelationRepository userBoardRelationRepository;

    // 학급에 보낸 등록 요청을 반환하는 함수
    public List<StudentRegistInfoDTO> getRegistRequestList() {
        CustomUserDetails userDetails = findCustomUserDetails();
        Integer boardId = userDetails.getBoardId();
        Integer userId = userDetails.getUserId();

        List<UserBoardRelation> relations = userBoardRelationRepository.findByBoardBoardIdAndStatus(boardId, UserBoardRelationStatus.WAITING);

        return relations != null ? relations.stream()
                .map(relation -> StudentRegistInfoDTO.builder()
                        .name(relation.getUser().getName())
                        .username(relation.getUser().getUsername())
                        .followDate(relation.getFollowDate().toLocalDate())
                        .build())
                .collect(Collectors.toList()) : null;
    }

    // 등록 요청을 수락하는 함수
    public CommonResponseDto approveRegist(Integer studentId) {
        CustomUserDetails userDetails = findCustomUserDetails();
        Integer boardId = userDetails.getBoardId();

        UserBoardRelation relation = userBoardRelationRepository.findByUserUserIdAndBoardBoardIdAndStatus(studentId, boardId, UserBoardRelationStatus.WAITING)
                .orElseThrow(() -> new CustomException(ErrorCode.NotFoundRegistration));

        relation.setStatus(UserBoardRelationStatus.ACCEPTED);
        userBoardRelationRepository.save(relation);
        return new CommonResponseDto("Approved");
    }

    // 등록 요청을 거절하는 함수
    public CommonResponseDto rejectRegist(Integer studentId) {
        CustomUserDetails userDetails = findCustomUserDetails();
        Integer boardId = userDetails.getBoardId();

        UserBoardRelation relation = userBoardRelationRepository.findByUserUserIdAndBoardBoardIdAndStatus(studentId, boardId, UserBoardRelationStatus.WAITING)
                .orElseThrow(() -> new CustomException(ErrorCode.NotFoundRegistration));

        relation.setStatus(UserBoardRelationStatus.BLOCKED);
        userBoardRelationRepository.save(relation);
        return new CommonResponseDto("Rejected");
    }

    // CustomUserDetail을 반환하는 함수
    public CustomUserDetails findCustomUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (CustomUserDetails) authentication.getPrincipal();
    }
}
