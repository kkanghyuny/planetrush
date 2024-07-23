package com.planetrush.planetrush.planet.facade.dto;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RegisterPlanetFacadeDto {

	// 행성 이름
	private String name;
	// 챌린지명
	private String content;
	// 카테고리
	private String category;
	// 시작날짜
	private LocalDate startDate;
	// 종료날짜
	private LocalDate endDate;
	// 인원 수
	private int maxParticipants;
	// 미션 조건
	private String authCond;
	// 행성 창조자
	private Long memberId;
	// 기본 행성 선택시 기본 행성의 id값
	private Long defaultImgId;
	// 행성 커스텀 이미지
	private MultipartFile planetImage;
	// 인증 예시 사진
	private MultipartFile verificationImage;
}