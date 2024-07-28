package com.planetrush.planetrush.planet.facade;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.planetrush.planetrush.planet.facade.dto.RegisterPlanetFacadeDto;
import com.planetrush.planetrush.planet.service.RegisterPlanetService;
import com.planetrush.planetrush.planet.service.dto.RegisterPlanetDto;
import com.planetrush.planetrush.planet.service.image.SaveImgService;

import lombok.RequiredArgsConstructor;

@Transactional
@RequiredArgsConstructor
@Component
public class RegisterPlanetFacade {

	private final SaveImgService saveImgService;
	private final RegisterPlanetService registerPlanetService;

	public void registerPlanet(RegisterPlanetFacadeDto dto) {
		Long planetImgId = dto.getPlanetImage().isEmpty() ? null :
			saveImgService.saveCustomPlanetImg(dto.getPlanetImage(), dto.getMemberId());
		Long standardVerificationImgId = saveImgService.saveStandardVerificationImg(dto.getVerificationImage(),
			dto.getMemberId());
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
			.standardPlanetImgId(standardVerificationImgId)
			.build());
	}
}
