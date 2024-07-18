package com.example.demo.service;

import com.example.demo.domain.classroom.school.entity.School;
import com.example.demo.domain.user.student.entity.Student;
import com.example.demo.domain.user.teacher.entity.Teacher;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthService {

//    public LoginResponse login(LoginRequest loginRequest) {
        // 실제 인증 로직 대신 더미 데이터 반환
    	
//        if ("root".equals(loginRequest.getUsername()) &&
//            "4321".equals(loginRequest.getPassword())) {
//            User user = new User(1L, "SSAM", "ssam@example.com", 5L, 10L);
//            String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
//            String refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
//            return new LoginResponse(token, refreshToken, user);
//        } else {
//            throw new RuntimeException("Invalid credentials");
//        }
//    }

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


    public void studentJoinProcess(Student student) {
        String username = student.getUsername();
        String password = student.getPassword();

        boolean ifExist = studentRepository.existsByUsername(username);

        if(ifExist) return;

        Student data = new Student();

        Date birth = student.getBirth();
        String student_name = student.getStudent_name();
        String student_phone = student.getStudent_phone();
        String student_img = student.getStudent_img();
        String parent_name = student.getParent_name();
        String parent_phone = student.getParent_phone();
        String parent_relation = student.getParent_relation();
        data.setUsername(username);
        data.setPassword(bCryptPasswordEncoder.encode(password)) ;
        data.setBirth(birth);
        data.setStudent_name(student_name);
        data.setStudent_phone(student_phone);
        data.setStudent_img(student_img);
        data.setParent_name(parent_name);
        data.setParent_phone(parent_phone);
        data.setParent_relation(parent_relation);

        studentRepository.save(data);
    }
    public void teacherJoinProcess(Teacher teacher) {
        String username = teacher.getUsername();

        boolean ifExist = teacherRepository.existsByUsername(username);

        if(ifExist) return;

        String password = teacher.getPassword();
        String name = teacher.getName();
        String phone = teacher.getPhone();
        String email = teacher.getEmail();
        String teacher_img = teacher.getTeacher_img();
        School school = teacher.getSchool();

        Teacher data = new Teacher();
        data.setUsername(username);
        data.setPassword(bCryptPasswordEncoder.encode(password)) ;
        data.setName(name);
        data.setPhone(phone);
        data.setEmail(email);
        data.setTeacher_img(teacher_img);
        data.setSchool(school);

        teacherRepository.save(data);
    }
}