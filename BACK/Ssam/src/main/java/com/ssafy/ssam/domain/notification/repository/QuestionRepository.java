package com.ssafy.ssam.domain.notification.repository;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.notification.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    Optional<Question> findByQuestionId(Integer questionId);
    Optional<List<Question>> findByBoard_BoardId(Integer boardId);
}
