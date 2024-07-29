package com.ssafy.ssam.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    DuplicateUserName(HttpStatus.BAD_REQUEST, "이미 존재하는 사용자 아이디 입니다"),
    Unauthorized(HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다."),
    UserNotFoundException(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다."),
    Forbidden(HttpStatus.FORBIDDEN, "접근 권한이 없는 사용자입니다."),
    IllegalArgument(HttpStatus.NOT_FOUND, "잘못된 인자 값입니다."),
    InvalidImageType(HttpStatus.BAD_REQUEST, "잘못된 이미지 파일입니다.");

    private final HttpStatus httpStatus;
    private final String errorMessage;
}
