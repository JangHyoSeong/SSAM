package com.ssafy.ssam.domain.user.service;

import com.ssafy.ssam.domain.user.dto.UserDto;
import com.ssafy.ssam.domain.user.entity.User;
import com.ssafy.ssam.domain.user.entity.UserRole;
import com.ssafy.ssam.domain.user.repository.UserRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.ErrorCode;
import com.ssafy.ssam.global.error.exception.DuplicateUserNameException;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Builder
@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public CommonResponseDto teacherJoinProcess(UserDto userDto){
        if(userRepository.existsByUsername(userDto.getUsername())) throw new DuplicateUserNameException(ErrorCode.DuplicateUserName);
        userDto.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        userDto.setRole(UserRole.TEACHER);
        userRepository.save(User.toUser(userDto));

        return new CommonResponseDto("OK");
    }

    @Transactional
    public CommonResponseDto studentJoinProcess(UserDto userDto){
        if(userRepository.existsByUsername(userDto.getUsername())) throw new DuplicateUserNameException(ErrorCode.DuplicateUserName);
        userDto.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        userDto.setRole(UserRole.STUDENT);
        userRepository.save(User.toUser(userDto));

        return new CommonResponseDto("OK");
    }
}
