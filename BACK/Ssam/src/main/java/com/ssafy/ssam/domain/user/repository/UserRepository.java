package com.ssafy.ssam.domain.user.repository;

import com.ssafy.ssam.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    // username 기반으로 존재하는지 여부 검증 jpa
    Boolean existsByUsername(String username);

    // username 이 DB에 존재하는지 jpa
    Optional<User> findByUsername(String username);
}
