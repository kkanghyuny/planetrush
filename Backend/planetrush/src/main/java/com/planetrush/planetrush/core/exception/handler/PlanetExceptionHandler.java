package com.planetrush.planetrush.core.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.core.template.response.ResponseCode;
import com.planetrush.planetrush.planet.exception.NegativeParticipantCountException;
import com.planetrush.planetrush.planet.exception.PlanetNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class PlanetExceptionHandler {

	@ExceptionHandler(PlanetNotFoundException.class)
	public ResponseEntity<BaseResponse<Object>> handlePlanetNotFoundException(PlanetNotFoundException ex) {
		log.error(ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BaseResponse.ofFail(ResponseCode.PLANET_NOT_FOUND));
	}

	@ExceptionHandler(NegativeParticipantCountException.class)
	public ResponseEntity<BaseResponse<Object>> handleResidentLimitExceededException(
		NegativeParticipantCountException ex) {
		log.error(ex.getMessage());
		return ResponseEntity.status(HttpStatus.CONFLICT)
			.body(BaseResponse.ofFail(ResponseCode.PARTICIPANTS_OVERFLOW));
	}

}
