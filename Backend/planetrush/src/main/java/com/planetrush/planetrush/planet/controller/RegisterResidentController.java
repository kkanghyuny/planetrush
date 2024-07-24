package com.planetrush.planetrush.planet.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.planetrush.core.aop.annotation.RequireJwtToken;
import com.planetrush.planetrush.core.aop.member.MemberContext;
import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.planet.service.RegisterResidentService;
import com.planetrush.planetrush.planet.service.dto.RegisterResidentDto;

import lombok.RequiredArgsConstructor;

/**
 * 행성 입주 신청을 하는 api입니다.
 */
@RequiredArgsConstructor
@RestController
public class RegisterResidentController extends PlanetController {

	private final RegisterResidentService registerResidentService;

	@RequireJwtToken
	@PostMapping("/{planet-id}")
	public ResponseEntity<BaseResponse<?>> registerResident(@PathVariable("planet-id") Long planetId) {
		Long memberId = MemberContext.getMemberId();
		registerResidentService.registerResident(
			RegisterResidentDto.builder().memberId(memberId).planetId(planetId).build());
		return ResponseEntity.ok(BaseResponse.ofSuccess());
	}
}
