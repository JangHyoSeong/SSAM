package com.ssafy.ssam.domain.user.repository;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.user.entity.UserBoardRelation;
import com.ssafy.ssam.domain.user.entity.UserBoardRelationStatus;
import com.ssafy.ssam.global.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBoardRelationRepository extends JpaRepository<UserBoardRelation, Integer> {
    Optional<UserBoardRelation> findByUserAndBoard(User user, Board board);
    Optional<UserBoardRelation> findByBoardAndStatus(Board board, UserBoardRelationStatus status);
    Optional<List<UserBoardRelation>> findUserBoardRelationsByUser(User user);

    @Query("SELECT u.user FROM UserBoardRelation u WHERE u.board = :board AND u.status = :status")
    List<User> findUsersByBoardAndStatus(Board board, UserBoardRelationStatus status);
}
