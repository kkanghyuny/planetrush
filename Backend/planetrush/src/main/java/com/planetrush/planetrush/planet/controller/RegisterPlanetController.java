package com.planetrush.planetrush.planet.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.planet.controller.request.RegisterPlanetReq;
import com.planetrush.planetrush.planet.service.RegisterPlanetService;
import com.planetrush.planetrush.planet.service.dto.RegisterPlanetDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class RegisterPlanetController extends PlanetController {

	// TODO: 이미지 관련 처리를 어떻게 할 것인가?
	// TODO: 1. 의존성 추가 2. aws 자격증명 구성 3. aws s3 서비스 구현 4. 이미지 저장하는 엔티티 5. 이미지 저장할 레포지토리 설정 6. s3클라이언트 설정
	private final RegisterPlanetService registerPlanetService;

	@PostMapping
	public ResponseEntity<BaseResponse<?>> registerPlanet(
		@RequestBody RegisterPlanetReq req) {
		registerPlanetService.registerPlanet(RegisterPlanetDto.builder()
			.name(req.getName())
			.memberId(req.getMemberId())
			.startDate(req.getStartDate())
			.endDate(req.getEndDate())
			.content(req.getContent())
			.maxParticipants(req.getMaxParticipants())
			.category(req.getCategory())
			.authCond(req.getAuthCond())
			.build());
		return ResponseEntity.ok(BaseResponse.ofSuccess());
	}

}
