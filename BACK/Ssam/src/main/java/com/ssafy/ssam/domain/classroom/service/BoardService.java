package com.ssafy.ssam.domain.classroom.service;

import com.ssafy.ssam.domain.AmazonS3.service.S3ImageService;
import com.ssafy.ssam.domain.classroom.dto.request.BoardCreateRequestDTO;
import com.ssafy.ssam.domain.classroom.dto.response.BoardGetResponseDTO;
import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.domain.user.entity.User;
import com.ssafy.ssam.domain.user.repository.UserRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Random;

@Slf4j
@RequiredArgsConstructor
@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
//    private final UserBoardRelationRepository userBoardRelationRepository;
    private final S3ImageService s3ImageService;

    // 보드 생성
    @Transactional
    public BoardGetResponseDTO createBoard(BoardCreateRequestDTO requestDTO) {
        User user = findUserByToken();

        if(user == null) throw new IllegalArgumentException("user doesn't exist");
        if(user.getBoard() != null) throw new CustomException(ErrorCode.BoardAlreadyExistsException);

        Integer grade = requestDTO.getGrade();
        Integer classroom = requestDTO.getClassroom();

        if (grade == null || grade < 1 || grade > 6 || classroom < 1)
            throw new CustomException(ErrorCode.InvalidClassroomData);

        Board board = Board.builder()
                .grade(requestDTO.getGrade())
                .classroom(requestDTO.getClassroom())
                .pin(generateUniquePin())
                .user(user)
                .build();

        Board savedBoard = boardRepository.save(board);

        return convertToResponseDTO(savedBoard);
    }


    // id를 통해 board 찾기
    @Transactional
    public BoardGetResponseDTO getBoardById(int classId) {
        Board board = boardRepository.findById(classId)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));
        return convertToResponseDTO(board);
    }

    // 학급 공지사항 수정
    public void updateNotice(int boardId, String notice) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        User user = findUserByToken();
        if (user != board.getUser())
            throw new CustomException(ErrorCode.BoardAccessDeniedException);

        board.setNotice(notice);
        boardRepository.save(board);
    }

    // 학급 배너 수정
    public void updateBanner(int boardId, String banner) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        User user = findUserByToken();
        if (user != board.getUser())
            throw new CustomException(ErrorCode.BoardAccessDeniedException);

        board.setBanner(banner);
        boardRepository.save(board);
    }

    // 학급 pin번호 재발급
    public void refreshPin(int boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        User user = findUserByToken();
        if (user != board.getUser())
            throw new CustomException(ErrorCode.BoardAccessDeniedException);

        board.setPin(generateUniquePin());
        boardRepository.save(board);
    }

    // 학급 배너이미지 수정
    public void updateBannerImage(int boardId, MultipartFile image) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        String imageUrl = s3ImageService.upload(image);
        User user = findUserByToken();
        if (user != board.getUser())
            throw new CustomException(ErrorCode.BoardAccessDeniedException);

        board.setBannerImg(imageUrl);
        boardRepository.save(board);
    }

    // 학급 삭제
    @Transactional
    public CommonResponseDto deleteClass(int boardId) {
        Board board = boardRepository.findByBoardId(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));

        User user = findUserByToken();
        if (user != board.getUser())
            throw new CustomException(ErrorCode.BoardAccessDeniedException);


        boardRepository.delete(board);
        return new CommonResponseDto("OK");
    }

    // 응답 객체 생성
    private BoardGetResponseDTO convertToResponseDTO(Board board) {
        return BoardGetResponseDTO.builder()
                .boardId(board.getBoardId())
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

    // 토큰으로부터 유저 정보 받기
    private User findUserByToken() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        return user;
    }



}
