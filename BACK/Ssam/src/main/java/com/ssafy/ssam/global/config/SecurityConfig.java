package com.ssafy.ssam.global.config;

import com.ssafy.ssam.global.jwt.JwtFilter;
import com.ssafy.ssam.global.jwt.JwtUtil;
import com.ssafy.ssam.global.jwt.LoginFilter;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Builder
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity // 시큐리티 설정을 위한
public class SecurityConfig {
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JwtUtil jwtUtil;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    // 얘가 진짜 찐으로 무시할때 쓰는 코드
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return webSecurity -> {
            webSecurity.ignoring()
                    .requestMatchers("/users/**");
        };
    }
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
    //해쉬를 암호화해 진행하기 위해서 필요한 것들

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

       return http.csrf((auth) -> auth.disable())
                .cors((auth) -> auth.disable())
                .formLogin((auth) -> auth.disable())
                .logout((auth) -> auth.disable())
                .httpBasic((auth) -> auth.disable())
                .authorizeHttpRequests((auth) -> auth
                // 아무 허용 필요없는 접근 -> 회원가입, 첫 화면, 비밀번호 찾기
                .requestMatchers("/auth/social-login/**","/auth/login/**", "/", "/join/**", "/users/teachers/**", "/users/students/**").permitAll()
                // 선생이라는 권한이 필요한 url
                .requestMatchers("/info/teacher/**", "/classroom/reissue/**", "/students/**").hasRole("TEACHER")
                // 학생이라는 권한이 필요한 url
                .requestMatchers("/info/students").hasRole("STUDENT")
                // 위에 말한 url 제외 모든 url은 로그인만 되어있으면 접근이 가능하다
                .anyRequest().authenticated())
               // 로그인 당시에 로그인 필터 적용 -> 토큰 저장
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil), UsernamePasswordAuthenticationFilter.class)
               // 다른 곳에 접근할려 할 때 권한을 가졌는지 토큰확인 필터 적용
                .addFilterBefore(new JwtFilter(jwtUtil), LoginFilter.class)

                .sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build();
    }
}
