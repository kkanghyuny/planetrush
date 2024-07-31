package com.planetrush.planetrush.core.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.core.template.response.ResponseCode;
import com.planetrush.planetrush.infra.s3.exception.S3Exception;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class S3imageExceptionHandler {

	@ExceptionHandler(S3Exception.class)
	public ResponseEntity<BaseResponse<Object>> handleS3ExceptionException(S3Exception e) {
		log.info(e.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(BaseResponse.ofFail(ResponseCode.FAIL_TO_UPLOAD_FILE));
	}
}
