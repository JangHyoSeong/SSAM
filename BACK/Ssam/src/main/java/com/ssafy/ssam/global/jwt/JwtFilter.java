package com.ssafy.ssam.global.jwt;

import com.ssafy.ssam.domain.user.dto.CustomUserDetails;
import com.ssafy.ssam.domain.user.entity.User;
import com.ssafy.ssam.domain.user.entity.UserRole;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Builder
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        if(authorization == null || !authorization.startsWith("Bearer ")) {
            System.out.println("Token null");
            filterChain.doFilter(request, response);

            return;
        }

        String token = authorization.split(" ")[1];

        if(jwtUtil.isExpired(token)){
            System.out.println("Token expired");
            filterChain.doFilter(request, response);
            return;
        }

        Integer userId = jwtUtil.getUserId(token);
        Integer boardId = jwtUtil.getBoardId(token);
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        CustomUserDetails customUserDetails = new CustomUserDetails(userId, boardId, username, "temppassword", role);

        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
