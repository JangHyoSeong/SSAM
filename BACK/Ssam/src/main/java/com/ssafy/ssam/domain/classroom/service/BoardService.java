package com.ssafy.ssam.domain.classroom.service;

import com.ssafy.ssam.domain.classroom.dto.response.BoardGetResponseDTO;
import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelation;
import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.domain.classroom.repository.UserBoardRelationRepository;
import com.ssafy.ssam.domain.user.entity.User;
import com.ssafy.ssam.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final UserBoardRelationRepository userBoardRelationRepository;

    // 의존성 주입
    @Autowired
    public BoardService(BoardRepository boardRepository, UserRepository userRepository, UserBoardRelationRepository userBoardRelationRepository) {
        this.boardRepository = boardRepository;
        this.userRepository = userRepository;
        this.userBoardRelationRepository = userBoardRelationRepository;
    }


    // 보드 생성
    @Transactional
    public BoardGetResponseDTO createBoard(@Valid BoardGetResponseDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("user doesn't exist"));

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
                .classId(board.getClassId())
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
