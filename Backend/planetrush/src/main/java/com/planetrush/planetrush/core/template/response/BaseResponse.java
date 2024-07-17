package com.planetrush.planetrush.core.template.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Getter;

@Getter
public class BaseResponse<T> {

	private static final String SUCCESS = "SUCCESS";
	private static final String FAIL = "FAIL";

	private final String code;
	@JsonProperty(value = "isSuccess")
	private final boolean success;
	private final String message;
	private final T data;

	@Builder
	private BaseResponse(String code, String message, boolean success, T data) {
		this.code = code;
		this.success = success;
		this.message = message;
		this.data = data;
	}

	/**
	 * 반환 데이터가 없는 성공 메시지 템플릿
	 * @param code 상태코드
	 * @param message 응답 메시지
	 * @return 자기 자신을 반환
	 * @param <T> null
	 */
	public static <T> BaseResponse<T> ofSuccess() {
		return BaseResponse.<T>builder()
			.code(ResponseCode.OK.getCode())
			.message(ResponseCode.OK.getMessage())
			.success(true)
			.data(null)
			.build();
	}

	/**
	 * 반환 데이터가 있는 성공 메시지 템플릿
	 * @param code 상태 코드
	 * @param message 응답 메시지
	 * @param data 반환 데이터
	 * @return 자기 자신을 반환
	 * @param <T> 반환되는 객체
	 */
	public static <T> BaseResponse<T> ofSuccess(T data) {
		return BaseResponse.<T>builder()
			.code(ResponseCode.OK.getCode())
			.message(ResponseCode.OK.getMessage())
			.success(true)
			.data(data)
			.build();
	}

	/**
	 * 예외를 반환하는 실패 메시지 템플릿
	 * @param code 상태코드
	 * @param message 응답 메시지
	 * @return 자기 자신을 반환
	 * @param <T> null
	 */
	public static <T> BaseResponse<T> ofFail(ResponseCode responseCode) {
		return BaseResponse.<T>builder()
			.code(responseCode.getCode())
			.message(responseCode.getMessage())
			.success(false)
			.data(null)
			.build();
	}

}