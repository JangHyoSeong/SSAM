package com.ssafy.ssam.domain.classroom.repository;

import com.ssafy.ssam.domain.classroom.entity.UserBoardRelation;
import com.ssafy.ssam.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBoardRelationRepository extends JpaRepository<UserBoardRelation, Integer> {
    Optional<List<UserBoardRelation>> findUserBoardRelationsByUser(User user);
}
