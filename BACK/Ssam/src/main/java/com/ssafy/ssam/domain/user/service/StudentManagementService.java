package com.ssafy.ssam.domain.user.service;

import com.ssafy.ssam.domain.classroom.entity.UserBoardRelation;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelationStatus;
import com.ssafy.ssam.domain.classroom.repository.UserBoardRelationRepository;
import com.ssafy.ssam.domain.user.dto.CustomUserDetails;
import com.ssafy.ssam.domain.user.dto.response.StudentRegistInfoDTO;
import com.ssafy.ssam.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class StudentManagementService {

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

    // CustomUserDetail을 반환하는 함수
    public CustomUserDetails findCustomUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (CustomUserDetails) authentication.getPrincipal();
    }
}
