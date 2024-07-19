package com.planetrush.planetrush.planet.service;

import org.springframework.stereotype.Service;

import com.planetrush.planetrush.core.exception.MemberNotFoundException;
import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.member.repository.MemberRepository;
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
	private final MemberRepository memberRepository;

	@Override
	public void registerPlanet(RegisterPlanetDto dto) {
		Planet planet = registerPlanetRepository.save(Planet.builder()
			.name(dto.getName())
			.category(Category.valueOf(dto.getCategory()))
			.content(dto.getContent())
			.startDate(dto.getStartDate())
			.endDate(dto.getEndDate())
			.maxParticipants(dto.getMaxParticipants())
			.authCond(dto.getAuthCond())
			.build());
		Member member = memberRepository.findById(dto.getMemberId())
			.orElseThrow(() -> new MemberNotFoundException("Member not found with ID: " + dto.getMemberId()));
		registerResidentRepository.save(Resident.isCreator(member, planet));
	}

}
