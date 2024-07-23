package com.planetrush.planetrush.planet.facade;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.planetrush.planetrush.image.service.ImageSaveService;
import com.planetrush.planetrush.planet.facade.dto.RegisterPlanetFacadeDto;
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

	public void registerPlanet(RegisterPlanetFacadeDto dto) {
		Long planetImgId = dto.getPlanetImage().isEmpty() ? null :
			planetImageSaveService.saveImage(dto.getPlanetImage(), dto.getMemberId());
		Long standardImgId = standardImageSaveService.saveImage(dto.getVerificationImage(), dto.getMemberId());

		registerPlanetService.registerPlanet(RegisterPlanetDto.builder()
			.name(dto.getName())
			.memberId(dto.getMemberId())
			.startDate(dto.getStartDate())
			.endDate(dto.getEndDate())
			.content(dto.getContent())
			.maxParticipants(dto.getMaxParticipants())
			.category(dto.getCategory())
			.authCond(dto.getAuthCond())
			.defaultImgId(dto.getDefaultImgId())
			.customPlanetImgId(planetImgId)
			.standardPlanetImgId(standardImgId)
			.build());
	}
}
