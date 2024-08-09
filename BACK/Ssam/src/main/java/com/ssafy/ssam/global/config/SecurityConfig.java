package com.ssafy.ssam.global.config;

import com.ssafy.ssam.global.error.CustomAccessDeniedHandler;
import com.ssafy.ssam.global.error.CustomAuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

import com.ssafy.ssam.global.auth.jwt.JwtFilter;
import com.ssafy.ssam.global.auth.jwt.JwtUtil;
import com.ssafy.ssam.global.auth.jwt.LoginFilter;

import lombok.Builder;
import lombok.RequiredArgsConstructor;


@Builder
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JwtUtil jwtUtil;
    private final CorsFilter corsFilter;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public static AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/v1/auth/**", "/v1/schools", "/v1/video/**").permitAll()
                        .requestMatchers("/v1/**").authenticated()
                        .requestMatchers("/v1/classrooms/answers/**", "/v1/classrooms/teachers/**", "/v1/consults/teachers/**").hasRole("TEACHER")
                        .anyRequest().permitAll())
                .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class)
                .with(new Custom(authenticationManager(authenticationConfiguration), jwtUtil), Custom::getClass)
                .build();
    }
    @RequiredArgsConstructor
    public static class Custom extends AbstractHttpConfigurer<Custom, HttpSecurity> {
        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;

        @Override
        public void configure(HttpSecurity http) {
            LoginFilter loginFilter = new LoginFilter(authenticationManager, jwtUtil);
            loginFilter.setFilterProcessesUrl("/v1/auth/login");
            loginFilter.setPostOnly(true);
            http.addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);
        }
    }

}
