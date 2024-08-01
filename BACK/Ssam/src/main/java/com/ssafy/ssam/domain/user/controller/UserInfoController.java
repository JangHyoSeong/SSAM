package com.ssafy.ssam.domain.user.controller;

import com.ssafy.ssam.domain.user.dto.response.UserInfoResponseDTO;
import com.ssafy.ssam.domain.user.service.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/v1/users")
@RestController
public class UserInfoController {

    private final UserInfoService userInfoService;

    // 사용자의 상세 정보를 제공하는 컨트롤러
    @GetMapping
    public ResponseEntity<UserInfoResponseDTO> getUserInfo () {
        return ResponseEntity.ok(userInfoService.getUserInfo());
    }

}
