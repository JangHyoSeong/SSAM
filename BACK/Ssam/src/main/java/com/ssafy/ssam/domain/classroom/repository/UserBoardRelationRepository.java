package com.ssafy.ssam.domain.classroom.repository;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelation;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelationStatus;
import com.ssafy.ssam.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBoardRelationRepository extends JpaRepository<UserBoardRelation, Integer> {
    Optional<UserBoardRelation> findByUserAndBoard(User user, Board board);
    Optional<UserBoardRelation> findByBoardAndStatus(Board board, UserBoardRelationStatus status);
    Optional<List<UserBoardRelation>> findUserBoardRelationsByUser(User user);
    Optional<List<User>> findUsersByBoardAndStatus(Board board, UserBoardRelationStatus status);
}
