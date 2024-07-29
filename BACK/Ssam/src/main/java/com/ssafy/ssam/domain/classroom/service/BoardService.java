package com.ssafy.ssam.domain.classroom.service;

import com.ssafy.ssam.domain.AmazonS3.service.S3ImageService;
import com.ssafy.ssam.domain.classroom.dto.request.BoardCreateRequestDTO;
import com.ssafy.ssam.domain.classroom.dto.response.BoardGetResponseDTO;
import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelation;
import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.domain.classroom.repository.UserBoardRelationRepository;
import com.ssafy.ssam.domain.user.entity.User;
import com.ssafy.ssam.domain.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Random;

@Slf4j
@RequiredArgsConstructor
@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final UserBoardRelationRepository userBoardRelationRepository;
    private final S3ImageService s3ImageService;

    // 보드 생성
    @Transactional
    public BoardGetResponseDTO createBoard(BoardCreateRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if(user == null) throw new IllegalArgumentException("user doesn't exist");

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


    // id를 통해 board 찾기
    @Transactional
    public BoardGetResponseDTO getBoardById(int classId) {
        Board board = boardRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        return convertToResponseDTO(board);
    }

    // 학급 공지사항 수정
    public void updateNotice(int boardId, String notice) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        board.setNotice(notice);
        boardRepository.save(board);
    }

    // 학급 배너 수정
    public void updateBanner(int boardId, String banner) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        board.setBanner(banner);
        boardRepository.save(board);
    }

    // 학급 pin번호 재발급
    public void refreshPin(int boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        board.setPin(generateUniquePin());
        boardRepository.save(board);
    }

    // 학급 배너이미지 수정
    public void updateBannerImage(int boardId, MultipartFile image) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        String imageUrl = s3ImageService.upload(image);
        board.setBannerImg(imageUrl);
        boardRepository.save(board);
    }

    // 응답 객체 생성
    private BoardGetResponseDTO convertToResponseDTO(Board board) {
        return BoardGetResponseDTO.builder()
                .classId(board.getClassId())
                .banner(board.getBanner())
                .bannerImg(board.getBannerImg())
                .pin(board.getPin())
                .grade(board.getGrade())
                .notice(board.getNotice())
                .classroom(board.getClassroom())
                .build();
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


}
