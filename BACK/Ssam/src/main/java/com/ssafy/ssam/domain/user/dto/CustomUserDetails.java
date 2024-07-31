package com.ssafy.ssam.domain.user.dto;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelation;
import com.ssafy.ssam.domain.classroom.entity.UserBoardRelationStatus;
import com.ssafy.ssam.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails{
    private final Integer userId;
    private final Integer boardId;
    private final String username;
    private final String password;
    private final String role;

    //roll 반환하는 것
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return role;
            }
        });
        return collection;
    }
    public Integer getUserId() { return userId; }

    public Integer getBoardId() { return boardId; }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
