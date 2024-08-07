package com.ssafy.ssam.domain.classroom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.user.entity.UserBoardRelationStatus;
import com.ssafy.ssam.global.auth.entity.User;

@Repository
public interface BoardRepository extends JpaRepository<Board, Integer> {
    boolean existsByPin(String pin);
    Optional<Board> findByBoardId(Integer boardId);
    Optional<Board> findByPin(String pin);
    
}
