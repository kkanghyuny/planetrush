package com.planetrush.planetrush.core.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.core.template.response.ResponseCode;
import com.planetrush.planetrush.planet.exception.PlanetNotFoundException;
import com.planetrush.planetrush.planet.exception.ResidentAlreadyExistsException;
import com.planetrush.planetrush.planet.exception.ResidentLimitExceededException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class PlanetExceptionHandler {

	@ExceptionHandler(PlanetNotFoundException.class)
	public ResponseEntity<BaseResponse<Object>> handlePlanetNotFoundException(PlanetNotFoundException ex) {
		log.error(ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BaseResponse.ofFail(ResponseCode.NO_MEMBER));
	}

	@ExceptionHandler(ResidentLimitExceededException.class)
	public ResponseEntity<BaseResponse<Object>> handleResidentLimitExceededException(
		ResidentLimitExceededException ex) {
		log.error(ex.getMessage());
		return ResponseEntity.status(HttpStatus.CONFLICT)
			.body(BaseResponse.ofFail(ResponseCode.RESIDENT_LIMIT_EXCEEDED));
	}

	@ExceptionHandler(ResidentAlreadyExistsException.class)
	public ResponseEntity<BaseResponse<Object>> handleResidentAlreadyExistsException(
		ResidentAlreadyExistsException ex) {
		log.error(ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(BaseResponse.ofFail(ResponseCode.ALREADY_EXIST_RESIDENT));
	}

}
