package com.planetrush.planetrush.core.template.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResponseCode {

	// 2000 - 성공
	OK("2000", "성공"),

	// 1000 - SECURITY
	UNAUTHENTICATED("1000", "인증되지 않은 사용자입니다."),
	JWT_TOKEN_EXPIRED("1001", "jwt 토큰이 파기되었습니다."),
	NO_ACCESS_PERMISSION("1002", "접근 권한이 없습니다."),

	// 3000 - MEMBER
	NO_MEMBER("3000", "회원이 존재하지 않습니다."),

	// 4000 - S3
	FILE_SIZE_OVERFLOW("4000", "개별 사진 사이즈는 최대 10MB, 총합 사이즈는 최대 100MB를 초과할 수 없습니다."),
	FAIL_TO_UPLOAD_FILE("4001", "AWS 서비스가 원활하지 않아 사진 업로드에 실패했습니다."),

	// 5000 - PLANET

	// 6000 - RESIDENT
	;

	private String code;
	private String message;

}