package com.planetrush.planetrush.core.exception.handler;

import static com.planetrush.planetrush.core.template.response.ResponseCode.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.planetrush.planetrush.core.jwt.exception.ExpiredJwtException;
import com.planetrush.planetrush.core.jwt.exception.UnAuthorizedException;
import com.planetrush.planetrush.core.jwt.exception.UnSupportedJwtException;
import com.planetrush.planetrush.core.template.response.BaseResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class AuthExceptionHandler {

	@ExceptionHandler(ExpiredJwtException.class)
	public ResponseEntity<BaseResponse<Object>> expiredJwtException(ExpiredJwtException e) {
		log.info(e.getMessage());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
			.body(BaseResponse.ofFail(EXPIRED_JWT_EXCEPTION));
	}

	@ExceptionHandler(UnAuthorizedException.class)
	public ResponseEntity<BaseResponse<Object>> unAuthorizedException(UnAuthorizedException e) {
		log.info(e.getMessage());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
			.body(BaseResponse.ofFail(UNAUTHORIZED_EXCEPTION));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<BaseResponse<Object>> illegalArgumentException(IllegalArgumentException e) {
		log.info(e.getMessage());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
			.body(BaseResponse.ofFail(UNAUTHORIZED_EXCEPTION));
	}

	@ExceptionHandler(UnSupportedJwtException.class)
	public ResponseEntity<BaseResponse<Object>> unSupportedJwtException(UnSupportedJwtException e) {
		log.info(e.getMessage());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
			.body(BaseResponse.ofFail(UNSUPPORTED_JWT_EXCEPTION));
	}
}
