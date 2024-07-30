package com.ssafy.ssam.domain.classroom.service;

import com.ssafy.ssam.domain.classroom.dto.request.BoardCreateRequestDTO;
import com.ssafy.ssam.domain.classroom.dto.response.BoardGetResponseDTO;
import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelation;
import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.domain.classroom.repository.UserBoardRelationRepository;
import com.ssafy.ssam.domain.user.entity.User;
import com.ssafy.ssam.domain.user.repository.UserRepository;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Slf4j
@RequiredArgsConstructor
@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final UserBoardRelationRepository userBoardRelationRepository;

    // 보드 생성
    @Transactional
    public BoardGetResponseDTO createBoard(@Valid BoardCreateRequestDTO requestDTO) {

        System.out.println("service");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        System.out.println("service2");
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        log.info(username);

        Board board = Board.builder()
                .grade(requestDTO.getGrade())
                .classroom(requestDTO.getClassroom())
                .pin(generateUniquePin())
                .build();

        Board savedBoard = boardRepository.save(board);
        UserBoardRelation relation = UserBoardRelation.builder()
                .user(user)
                .board(savedBoard)
                .build();
        userBoardRelationRepository.save(relation);
        return convertToResponseDTO(savedBoard);
    }

    // 핀번호 생성
    private String generateUniquePin() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder pin = new StringBuilder();
        Random random = new Random();

        do {
            pin.setLength(0); // Clear the StringBuilder
            for (int i = 0; i < 6; i++) {
                pin.append(characters.charAt(random.nextInt(characters.length())));
            }
        } while (boardRepository.existsByPin(pin.toString()));

        return pin.toString();
    }

    // 응답 객체 생성
    private BoardGetResponseDTO convertToResponseDTO(Board board) {
        return BoardGetResponseDTO.builder()
                .classId(board.getBoardId())
                .pin(board.getPin())
                .grade(board.getGrade())
                .classroom(board.getClassroom())
                .build();
    }

    // id를 통해 board 찾기
    @Transactional
    public BoardGetResponseDTO getBoardById(int classId) {
        Board board = boardRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        return convertToResponseDTO(board);
    }


}
