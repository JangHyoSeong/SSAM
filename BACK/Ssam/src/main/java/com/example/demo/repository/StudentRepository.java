package com.example.demo.repository;

import com.example.demo.domain.user.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Boolean existsByUsername(String username);
}