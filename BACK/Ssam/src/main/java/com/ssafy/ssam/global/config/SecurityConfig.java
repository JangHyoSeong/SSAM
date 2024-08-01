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
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.ssafy.ssam.global.jwt.JwtFilter;
import com.ssafy.ssam.global.jwt.JwtUtil;
import com.ssafy.ssam.global.jwt.LoginFilter;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Builder;
import lombok.RequiredArgsConstructor;

@Builder
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity // 시큐리티 설정을 위한
public class SecurityConfig {
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JwtUtil jwtUtil;

    @Bean
    public static AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

//    // 얘가 진짜 찐으로 무시할때 쓰는 코드
//    @Bean
//    public WebSecurityCustomizer webSecurityCustomizer() {
//        return webSecurity -> {
//            webSecurity.ignoring()
//                    .requestMatchers("/v1/auth/students", "/v1/auth/teachers");
//        };
//    }
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
    //해쉬를 암호화해 진행하기 위해서 필요한 것들

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

       return http
//               .cors((cors) -> cors
//                       .configurationSource((new CorsConfigurationSource() {
//                           @Override
//                           public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
//                               CorsConfiguration config = new CorsConfiguration();
//                               config.setAllowedOrigins(Collections.singletonList("*"));
//                               //config.setAllowedOrigins(Collections.singletonList("https://i11e201.p.ssafy.io:3000"));
//                               /*config.setAllowedOrigins(Arrays.asList(
//                                       "https://i11e201.p.ssafy.io:3000",
//                                       "http://localhost:3000",
//                                       "http://127.0.0.1:3000"
//                                   ));*/
//
//                               config.setAllowedMethods(Collections.singletonList("*"));
//                               config.setAllowCredentials(true);
//                               config.setAllowedHeaders(Collections.singletonList("*"));
//                               config.setMaxAge(3600L);
//
//                               config.setExposedHeaders(Collections.singletonList("Authorization"));
//                               return config;
//                           }
//                       })))
               .csrf((auth) -> auth.disable())
               //.cors((auth) -> auth.disable())
               .formLogin((auth) -> auth.disable())
               .logout((auth) -> auth.disable())
               .httpBasic((auth) -> auth.disable())
               .authorizeHttpRequests((auth) -> auth
//                 아무 허용 필요없는 접근 -> 회원가입, 첫 화면, 비밀번호 찾기
                    .requestMatchers("/v1/auth/**").permitAll()
                // 선생이라는 권한이 필요한 url
                    .requestMatchers("/v1/classrooms/answers/**", "/v1/classrooms/teachers/**", "/v1/consults/teachers/**").permitAll()

                // 위에 말한 url 제외 모든 url은 로그인만 되어있으면 접근이 가능하다
                    .anyRequest().authenticated())

               // 필터 모아서 처리
                .with(new Custom(
                       authenticationConfiguration,
                       jwtUtil), Custom::getClass
                )
                .sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build();
    }
    @RequiredArgsConstructor
    public static class Custom extends AbstractHttpConfigurer<Custom, HttpSecurity> {
        private final AuthenticationConfiguration authenticationConfiguration;
        private final JwtUtil jwtUtil;

        @Override
        public void configure(HttpSecurity http) throws Exception {
            LoginFilter loginFilter = new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil);

            // login url 수정
            loginFilter.setFilterProcessesUrl("/v1/auth/login");
            loginFilter.setPostOnly(true);

            http
                    // 로그인 당시에 로그인 필터 적용 -> 토큰 저장
                    .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class)
                    // 다른 곳에 접근할려 할 때 권한을 가졌는지 토큰확인 필터 적용
                    .addFilterBefore(new JwtFilter(jwtUtil), LoginFilter.class);
        }
    }

}
