package com.ssafy.ssam.domain.classroom.service;

import com.ssafy.ssam.domain.AmazonS3.service.S3ImageService;
import com.ssafy.ssam.domain.classroom.dto.request.BoardCreateRequestDTO;
import com.ssafy.ssam.domain.classroom.dto.response.BoardGetResponseDTO;
import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelation;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelationStatus;
import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.domain.classroom.repository.UserBoardRelationRepository;
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

import java.time.LocalDateTime;
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
        User user = findUserByToken();

        if (user == null) throw new IllegalArgumentException("user doesn't exist");

        // 기존에 생성한 학급이 있다면 예외처리
        if (user.getBoards() != null && !user.getBoards().isEmpty()) {
            for (UserBoardRelation relation : user.getBoards()) {
                if (relation.getBoard().getIs_deprecated() == 0) {
                    throw new CustomException(ErrorCode.BoardAlreadyExistsException);
                }
            }
        }

        Integer grade = requestDTO.getGrade();
        Integer classroom = requestDTO.getClassroom();

        if (grade == null || grade < 1 || grade > 6 || classroom < 1)
            throw new CustomException(ErrorCode.InvalidClassroomData);

        Board board = Board.builder()
                .grade(requestDTO.getGrade())
                .classroom(requestDTO.getClassroom())
                .pin(generateUniquePin())
                .is_deprecated(0)
                .build();

        Board savedBoard = boardRepository.save(board);

        UserBoardRelation relation = UserBoardRelation.builder()
                .user(user)
                .board(savedBoard)
                .status(UserBoardRelationStatus.OWNER)
                .followDate(LocalDateTime.now())
                .build();

        userBoardRelationRepository.save(relation);

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
    public CommonResponseDto updateNotice(int boardId, String notice) {
        Board board = boardRepository.findByBoardId(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));

        User user = findUserByToken();
        UserBoardRelation relation = userBoardRelationRepository.findByUserAndBoard(user, board)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardAccessDeniedException));

        board.setNotice(notice);
        boardRepository.save(board);

        return new CommonResponseDto("Update Notice Completed");
    }

    // 학급 배너 수정
    public CommonResponseDto updateBanner(int boardId, String banner) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));

        User user = findUserByToken();
        UserBoardRelation relation = userBoardRelationRepository.findByUserAndBoard(user, board)
                        .orElseThrow(() -> new CustomException(ErrorCode.BoardAccessDeniedException));

        board.setBanner(banner);
        boardRepository.save(board);

        return new CommonResponseDto("Update Banner Completed");
    }

    // 학급 pin번호 재발급
    public CommonResponseDto refreshPin(int boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));

        User user = findUserByToken();
        UserBoardRelation relation = userBoardRelationRepository.findByUserAndBoard(user, board)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardAccessDeniedException));

        board.setPin(generateUniquePin());
        boardRepository.save(board);

        return new CommonResponseDto("Reissue PIN Completed");
    }

    // 학급 배너이미지 수정
    public CommonResponseDto updateBannerImage(int boardId, MultipartFile image) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));
        String imageUrl = s3ImageService.upload(image);

        User user = findUserByToken();
        UserBoardRelation relation = userBoardRelationRepository.findByUserAndBoard(user, board)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardAccessDeniedException));

        board.setBannerImg(imageUrl);
        boardRepository.save(board);

        return new CommonResponseDto("Update Banner Image Completed");
    }

    // 학급 삭제
    @Transactional
    public CommonResponseDto deleteClass(int boardId) {
        Board board = boardRepository.findByBoardId(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));

        User user = findUserByToken();
        UserBoardRelation relation = userBoardRelationRepository.findByUserAndBoard(user, board)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardAccessDeniedException));

        board.setIs_deprecated(1);
        boardRepository.save(board);

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
        User user = userRepository.findByUsername(username).orElseThrow(()->new CustomException(ErrorCode.UserNotFoundException));

        return user;
    }



}
