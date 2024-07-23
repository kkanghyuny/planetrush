package com.planetrush.planetrush.planet.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.planet.controller.request.RegisterPlanetReq;
import com.planetrush.planetrush.planet.facade.RegisterPlanetFacade;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
public class RegisterPlanetController extends PlanetController {

	private final RegisterPlanetFacade registerPlanetFacade;

	@PostMapping
	public ResponseEntity<BaseResponse<?>> registerPlanet(
		@RequestPart(name = "planetImage", required = false) MultipartFile planetImage,
		@RequestPart(name = "verificationImage") MultipartFile verificationImage,
		@RequestPart(name = "req") RegisterPlanetReq req) {
		registerPlanetFacade.registerPlanet(planetImage, verificationImage, req);
		return ResponseEntity.ok(BaseResponse.ofSuccess());
	}
}
