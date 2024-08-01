package com.ssafy.ssam.domain.classroom.repository;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelation;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelationStatus;
import com.ssafy.ssam.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBoardRelationRepository extends JpaRepository<UserBoardRelation, Integer> {
    Optional<UserBoardRelation> findByUserAndBoard(User user, Board board);
    Optional<UserBoardRelation> findByBoardAndStatus(Board board, UserBoardRelationStatus status);
    List<UserBoardRelation> findByBoardBoardIdAndStatus(Integer boardId, UserBoardRelationStatus status);
    Optional<List<UserBoardRelation>> findUserBoardRelationsByUser(User user);
    Optional<UserBoardRelation> findByUserUserIdAndBoardBoardIdAndStatus(Integer userId, Integer boardId, UserBoardRelationStatus status);

    @Query("SELECT u.user FROM UserBoardRelation u WHERE u.board = :board AND u.status = :status")
    List<User> findUsersByBoardAndStatus(Board board, UserBoardRelationStatus status);
}
