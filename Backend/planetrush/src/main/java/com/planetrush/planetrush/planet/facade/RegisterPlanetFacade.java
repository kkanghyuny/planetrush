package com.planetrush.planetrush.planet.facade;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.planetrush.planetrush.image.service.ImageSaveService;
import com.planetrush.planetrush.planet.controller.request.RegisterPlanetReq;
import com.planetrush.planetrush.planet.service.RegisterPlanetService;
import com.planetrush.planetrush.planet.service.dto.RegisterPlanetDto;

@Component
public class RegisterPlanetFacade {

	private final RegisterPlanetService registerPlanetService;
	private final ImageSaveService planetImageSaveService;
	private final ImageSaveService standardImageSaveService;

	public RegisterPlanetFacade(RegisterPlanetService registerPlanetService,
		@Qualifier("customImageSaveServiceImpl") ImageSaveService planetImageSaveService,
		@Qualifier("standardVerificationImageSaveServiceImpl") ImageSaveService standardImageSaveService) {
		this.registerPlanetService = registerPlanetService;
		this.planetImageSaveService = planetImageSaveService;
		this.standardImageSaveService = standardImageSaveService;
	}

	public void registerPlanet(MultipartFile planetFile, MultipartFile authFile, RegisterPlanetReq req) {
		Long planetImgId = planetFile.isEmpty() ? null : planetImageSaveService.saveImage(planetFile, req.getMemberId());
		Long standardImgId = standardImageSaveService.saveImage(authFile, req.getMemberId());

		registerPlanetService.registerPlanet(RegisterPlanetDto.builder()
			.name(req.getName())
			.memberId(req.getMemberId())
			.startDate(req.getStartDate())
			.endDate(req.getEndDate())
			.content(req.getContent())
			.maxParticipants(req.getMaxParticipants())
			.category(req.getCategory())
			.authCond(req.getAuthCond())
			.defaultImgId(req.getDefaultImgId())
			.customPlanetImgId(planetImgId)
			.standardPlanetImgId(standardImgId)
			.build());
	}
}
