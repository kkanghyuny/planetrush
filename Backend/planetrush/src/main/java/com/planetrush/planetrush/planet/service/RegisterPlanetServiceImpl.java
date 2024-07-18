package com.planetrush.planetrush.planet.service;

import org.springframework.stereotype.Service;

import com.planetrush.planetrush.planet.domain.Category;
import com.planetrush.planetrush.planet.domain.Planet;
import com.planetrush.planetrush.planet.domain.Resident;
import com.planetrush.planetrush.planet.repository.RegisterPlanetRepository;
import com.planetrush.planetrush.planet.repository.RegisterResidentRepository;
import com.planetrush.planetrush.planet.service.dto.RegisterPlanetDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RegisterPlanetServiceImpl implements RegisterPlanetService {

	private final RegisterPlanetRepository registerPlanetRepository;
	private final RegisterResidentRepository registerResidentRepository;

	@Override
	public void registerPlanet(RegisterPlanetDto dto) {
		// TODO: 회원조회 추가할 것
		Planet planet = registerPlanetRepository.save(Planet.builder()
			.name(dto.getName())
			.category(Category.valueOf(dto.getCategory()))
			.content(dto.getContent())
			.startDate(dto.getStartDate())
			.endDate(dto.getEndDate())
			.maxParticipants(dto.getMaxParticipants())
			.authCond(dto.getAuthCond())
			.build());
		registerResidentRepository.save(Resident.isCreator(null, planet));
	}

}
