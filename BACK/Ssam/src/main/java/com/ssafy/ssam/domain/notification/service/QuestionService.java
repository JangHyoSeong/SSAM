package com.ssafy.ssam.domain.notification.service;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.domain.notification.dto.request.QuestionRequestDto;
import com.ssafy.ssam.domain.notification.dto.response.QuestionResponseDto;
import com.ssafy.ssam.domain.notification.entity.Question;
import com.ssafy.ssam.domain.notification.repository.QuestionRepository;
import com.ssafy.ssam.domain.user.entity.User;
import com.ssafy.ssam.domain.user.repository.UserRepository;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import jakarta.persistence.EntityManager;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Builder
@Transactional
@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    public QuestionResponseDto createQuestion(Integer boardId, QuestionRequestDto questionRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 질문자 존재여부 검증
        User student = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        // 반 존재여부 검증, 반 이름이랑 요청이랑 맞는지 한 번 더 검증
        Board board = boardRepository.findByBoardId(boardId).orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));
        if(!questionRequestDto.getBoardId().equals(boardId)) throw new CustomException(ErrorCode.IllegalArgument);

        Question question = Question.toQuestion(student, board, questionRequestDto);

        return Question.toQuestionResponseDto(questionRepository.save(question));
    }
}
