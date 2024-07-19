package com.planetrush.planetrush.core.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.core.template.response.ResponseCode;
import com.planetrush.planetrush.member.exception.MemberNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class MemberExceptionHandler {

	@ExceptionHandler(MemberNotFoundException.class)
	public ResponseEntity<BaseResponse<Object>> handleMemberNotFoundException(MemberNotFoundException ex) {
		log.error(ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BaseResponse.ofFail(ResponseCode.NO_MEMBER));
	}
}
