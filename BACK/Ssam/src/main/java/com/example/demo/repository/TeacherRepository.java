package com.example.demo.repository;

import com.example.demo.domain.user.teacher.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Boolean existsByUsername(String username);
}