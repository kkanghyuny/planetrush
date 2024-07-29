package com.planetrush.planetrush.core.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.core.template.response.ResponseCode;
import com.planetrush.planetrush.planet.exception.RegisterResidentTimeoutException;
import com.planetrush.planetrush.planet.exception.ResidentAlreadyExistsException;
import com.planetrush.planetrush.planet.exception.ResidentExitTimeoutException;
import com.planetrush.planetrush.planet.exception.ResidentNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class ResidentExceptionHandler {

	@ExceptionHandler(ResidentAlreadyExistsException.class)
	public ResponseEntity<BaseResponse<Object>> handleResidentAlreadyExistsException(
		ResidentAlreadyExistsException ex) {
		log.error(ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(BaseResponse.ofFail(ResponseCode.ALREADY_EXIST_RESIDENT));
	}

	@ExceptionHandler(ResidentNotFoundException.class)
	public ResponseEntity<BaseResponse<Object>> handleResidentNotFoundException(ResidentNotFoundException ex) {
		log.error(ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(BaseResponse.ofFail(ResponseCode.RESIDENT_NOT_FOUND));
	}

	@ExceptionHandler(ResidentExitTimeoutException.class)
	public ResponseEntity<BaseResponse<Object>> handleResidentExitTimeoutException(ResidentExitTimeoutException ex) {
		log.error(ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(BaseResponse.ofFail(ResponseCode.RESIDENT_EXIT_TIMEOUT));
	}

	@ExceptionHandler(RegisterResidentTimeoutException.class)
	public ResponseEntity<BaseResponse<Object>> handleResidentTimeoutException(RegisterResidentTimeoutException ex) {
		log.error(ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(BaseResponse.ofFail(ResponseCode.REGISTER_RESIDENT_TIMEOUT));
	}
}
