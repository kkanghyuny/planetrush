package com.planetrush.planetrush.planet.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.planet.controller.request.RegisterPlanetReq;
import com.planetrush.planetrush.planet.service.RegisterResidentService;
import com.planetrush.planetrush.planet.service.dto.RegisterResidentDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class RegisterResidentController extends PlanetController {

	private final RegisterResidentService registerResidentService;

	@PostMapping("/{planet-id}")
	public ResponseEntity<BaseResponse<?>> registerResident(@PathVariable("planet-id") Long planetId,
		@RequestBody RegisterPlanetReq req) {
		registerResidentService.registerResident(
			RegisterResidentDto.builder().memberId(req.getMemberId()).planetId(planetId).build());
		return ResponseEntity.ok(BaseResponse.ofSuccess());
	}
}
