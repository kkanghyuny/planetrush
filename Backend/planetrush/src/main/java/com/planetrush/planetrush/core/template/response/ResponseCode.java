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
	MEMBER_NOT_FOUND("3000", "회원이 존재하지 않습니다."),

	// 4000 - S3
	FILE_SIZE_OVERFLOW("4000", "개별 사진 사이즈는 최대 10MB, 총합 사이즈는 최대 100MB를 초과할 수 없습니다."),
	FAIL_TO_UPLOAD_FILE("4001", "AWS 서비스가 원활하지 않아 사진 업로드에 실패했습니다."),
	FILE_NOT_FOUND("4002", "이미지 파일을 찾을 수 없습니다."),

	// 5000 - PLANET
	PLANET_NOT_FOUND("5000", "행성이 존재하지 않습니다."),
	PARTICIPANTS_OVERFLOW("5001", "최대 참여 인원 수를 초과했습니다."),
	NEGATIVE_PARTICIPANT_COUNT("5002", "현재 참여 인원 수는 음수가 될 수 없습니다."),

	// 6000 - RESIDENT
	RESIDENT_NOT_FOUND("6000", "거주자가 존재하지 않습니다."),
	ALREADY_EXIST_RESIDENT("5003", "이미 행성에 거주 중입니다."),
	;

	private String code;
	private String message;

}