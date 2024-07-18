package com.planetrush.planetrush.planet.controller.request;

import java.time.LocalDate;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RegisterPlanetReq {

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

}
