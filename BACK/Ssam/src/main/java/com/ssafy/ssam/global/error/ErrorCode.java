package com.ssafy.ssam.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
@AllArgsConstructor
@Getter
public enum ErrorCode {

//    BINDING_ERROR(HttpStatus.BAD_REQUEST),
    IllegalArgument(HttpStatus.NOT_FOUND, "잘못된 인자 값입니다."),

    // userException
    DuplicateUserName(HttpStatus.BAD_REQUEST, "이미 존재하는 사용자 아이디 입니다"),
    Unauthorized(HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다."),
    UserNotFoundException(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다."),
    Forbidden(HttpStatus.FORBIDDEN, "접근 권한이 없는 사용자입니다."),
    InvalidImageType(HttpStatus.BAD_REQUEST, "잘못된 이미지 파일입니다."),

    // consultException
    UnavailableDate(HttpStatus.BAD_REQUEST, "예약이 불가능한 날짜입니다."),

    // boardException
    BoardNotFoundException(HttpStatus.NOT_FOUND, "존재하지 않는 학급입니다."),
    InvalidClassroomData(HttpStatus.BAD_REQUEST, "학급 생성에 필요한 정보가 기입되지 않았습니다"),
    BoardAccessDeniedException(HttpStatus.FORBIDDEN, "학급에 접근 권한이 없습니다."),
    BoardAlreadyExistsException(HttpStatus.BAD_REQUEST, "이미 학급이 존재합니다");

    private final HttpStatus httpStatus;
    private String errorMessage;
}
