package com.example.demo.domain.user.student.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int student_id;

    @Column(nullable = false)
    private Date birth;

    @Column
    @Size(min = 11, max = 11)
    private String student_phone;

    @Column(length = 22)
    private String student_name;

    @Column
    private String student_img;

    @Column
    @Size(min = 11, max = 11)
    private String parent_phone;

    @Column(length = 22)
    private String parent_name;

    @Column(length = 1)
    private String parent_relation;

    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @Column(nullable = false)
    private String password;
}
