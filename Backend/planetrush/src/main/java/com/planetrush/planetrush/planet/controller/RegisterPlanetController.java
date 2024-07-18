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

	private final RegisterPlanetService registerPlanetService;

	@PostMapping
	public ResponseEntity<BaseResponse<?>> registerPlanet(@RequestBody RegisterPlanetReq req) {
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
