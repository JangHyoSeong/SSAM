package com.ssafy.ssam.domain.classroom.repository;

import com.ssafy.ssam.domain.classroom.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Integer> {
    boolean existsByPin(String pin);
    Optional<Board> findByBoardId(Integer boardId);

}
