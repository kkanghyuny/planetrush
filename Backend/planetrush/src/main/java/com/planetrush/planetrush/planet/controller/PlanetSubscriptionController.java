package com.planetrush.planetrush.planet.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.planetrush.core.aop.annotation.RequireJwtToken;
import com.planetrush.planetrush.core.aop.member.MemberContext;
import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.planet.service.PlanetSubscriptionService;
import com.planetrush.planetrush.planet.service.dto.PlanetSubscriptionDto;

import lombok.RequiredArgsConstructor;

/**
 * 행성 입주, 탈퇴 신청을 하는 api입니다.
 */
@RequiredArgsConstructor
@RestController
public class PlanetSubscriptionController extends PlanetController {

	private final PlanetSubscriptionService planetSubscriptionService;

	@RequireJwtToken
	@PostMapping("/{planet-id}")
	public ResponseEntity<BaseResponse<?>> registerResident(@PathVariable("planet-id") Long planetId) {
		Long memberId = MemberContext.getMemberId();
		planetSubscriptionService.registerResident(
			PlanetSubscriptionDto.builder().memberId(memberId).planetId(planetId).build());
		return ResponseEntity.ok(BaseResponse.ofSuccess());
	}

	@RequireJwtToken
	@DeleteMapping("/{planet-id}")
	public ResponseEntity<BaseResponse<?>> deleteResident(@PathVariable("planet-id") Long planetId) {
		Long memberId = MemberContext.getMemberId();
		planetSubscriptionService.deleteResident(
			PlanetSubscriptionDto.builder().memberId(memberId).planetId(planetId).build());
		return ResponseEntity.ok(BaseResponse.ofSuccess());
	}

}
