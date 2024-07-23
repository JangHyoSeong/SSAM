package com.ssafy.ssam.classroom.repository;

import com.ssafy.ssam.classroom.entity.UserBoardRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBoardRelationRepository extends JpaRepository<UserBoardRelation, Integer> {
}
