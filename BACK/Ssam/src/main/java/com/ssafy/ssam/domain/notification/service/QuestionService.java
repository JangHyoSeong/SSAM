package com.ssafy.ssam.domain.notification.service;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.domain.notification.dto.request.QuestionRequestDto;
import com.ssafy.ssam.domain.notification.dto.response.QuestionResponseDto;
import com.ssafy.ssam.domain.notification.entity.Question;
import com.ssafy.ssam.domain.notification.repository.QuestionRepository;
import com.ssafy.ssam.domain.user.dto.CustomUserDetails;
import com.ssafy.ssam.domain.user.entity.User;
import com.ssafy.ssam.domain.user.repository.UserRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Builder
@Transactional
@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;


    @Transactional(readOnly = true)
    public List<QuestionResponseDto> getQuestions(Integer boardId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails details = (CustomUserDetails) authentication.getPrincipal();

        // 사용자가 학급에 접근할 수 있는 권한이 있는지 검증
        if(!details.getBoardId().equals(boardId)) throw new CustomException(ErrorCode.IllegalArgument);

        List<QuestionResponseDto> list = new ArrayList<>();
        List<Question> questions = questionRepository.findByBoard_BoardId(boardId).orElse(new ArrayList<>());
        for(Question question : questions){
            list.add(Question.toQuestionResponseDto(question));
        }
        return list;
    }
    public QuestionResponseDto createQuestion(Integer boardId, QuestionRequestDto questionRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails details = (CustomUserDetails) authentication.getPrincipal();

        // 사용자가 학급에 접근할 수 있는 권한이 있는지 검증
        if(!details.getBoardId().equals(boardId)) throw new CustomException(ErrorCode.IllegalArgument);

        // 사용자 존재여부 검증
        User student = userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        // 반 존재여부 검증, 반 이름이랑 요청이랑 맞는지 한 번 더 검증
        Board board = boardRepository.findByBoardId(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));

        Question question = Question.toQuestion(student, board, questionRequestDto);

        return Question.toQuestionResponseDto(questionRepository.save(question));
    }
    public CommonResponseDto deleteQuestion(Integer questionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails details = (CustomUserDetails) authentication.getPrincipal();

        Question question = questionRepository.findByQuestionId(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QuestionNotFoundException));
        if(!question.getBoard().getBoardId().equals(details.getBoardId()))
            throw new CustomException(ErrorCode.IllegalArgument);

        questionRepository.delete(question);

        return new CommonResponseDto("ok");
    }
}
