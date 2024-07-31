package com.ssafy.ssam.domain.user.service;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelation;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelationStatus;
import com.ssafy.ssam.domain.classroom.repository.UserBoardRelationRepository;
import com.ssafy.ssam.domain.user.dto.CustomUserDetails;
import com.ssafy.ssam.domain.user.entity.User;
import com.ssafy.ssam.domain.user.repository.UserRepository;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserBoardRelationRepository userBoardRelationRepository;
    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        List<UserBoardRelation> userBoardRelations = userBoardRelationRepository.findUserBoardRelationsByUser(user)
                .orElse(new ArrayList<>());

        for(UserBoardRelation relation : userBoardRelations){
            if(!relation.getStatus().equals(UserBoardRelationStatus.ACCEPTED)
                    && !relation.getStatus().equals(UserBoardRelationStatus.OWNER)) continue;
            if(relation.getBoard().getIsDeprecated().equals("1")) continue;
            return new CustomUserDetails(user.getUserId(), relation.getBoard().getBoardId(),
                user.getUsername(), user.getPassword(), user.getRole().toString());
        }

        return new CustomUserDetails(user.getUserId(), null,
                user.getUsername(), user.getPassword(), user.getRole().toString());
    }
}
