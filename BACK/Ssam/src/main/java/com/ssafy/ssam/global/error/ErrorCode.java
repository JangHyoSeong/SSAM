package com.ssafy.ssam.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
@AllArgsConstructor
@Getter
public enum ErrorCode {

    BINDING_ERROR(HttpStatus.BAD_REQUEST),

    // userException
    DuplicateUserName(HttpStatus.BAD_REQUEST, "이미 존재하는 사용자 아이디 입니다"),
    Unauthorized(HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다."),
    UserNotFoundException(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다."),
    Forbidden(HttpStatus.FORBIDDEN, "접근 권한이 없는 사용자입니다."),
    IllegalArgument(HttpStatus.NOT_FOUND, "잘못된 인자 값입니다."),

    // consultException

    UnavailableDate(HttpStatus.BAD_REQUEST, "예약이 불가능한 날짜입니다."),
    Unfilled(HttpStatus.BAD_REQUEST, "필요한 정보가 전부 기입되지 않았습니다.");


    // hiException


    private final HttpStatus httpStatus;
    private String errorMessage;
}
