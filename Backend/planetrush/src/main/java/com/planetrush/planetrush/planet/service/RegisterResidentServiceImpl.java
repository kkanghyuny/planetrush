package com.planetrush.planetrush.planet.service;

import org.springframework.stereotype.Service;

import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.member.exception.MemberNotFoundException;
import com.planetrush.planetrush.member.repository.MemberRepository;
import com.planetrush.planetrush.planet.domain.Planet;
import com.planetrush.planetrush.planet.domain.Resident;
import com.planetrush.planetrush.planet.exception.PlanetNotFoundException;
import com.planetrush.planetrush.planet.exception.ResidentAlreadyExistsException;
import com.planetrush.planetrush.planet.repository.PlanetRepository;
import com.planetrush.planetrush.planet.repository.ResidentRepository;
import com.planetrush.planetrush.planet.service.dto.RegisterResidentDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RegisterResidentServiceImpl implements RegisterResidentService {

	private final MemberRepository memberRepository;
	private final PlanetRepository planetRepository;
	private final ResidentRepository residentRepository;

	@Override
	public void registerResident(RegisterResidentDto dto) {
		Member member = memberRepository.findById(dto.getMemberId()).orElseThrow(() -> new MemberNotFoundException());
		Planet planet = planetRepository.findById(dto.getPlanetId())
			.orElseThrow(() -> new PlanetNotFoundException("planet not found id: " + dto.getPlanetId()));
		residentRepository.findByMemberIdAndPlanetId(member.getId(), planet.getId())
			.ifPresent(resident -> {
				throw new ResidentAlreadyExistsException("resident already exists: " + resident.getId());
			});
		planet.addParticipant();
		residentRepository.save(Resident.isNotCreator(member, planet));
	}
}
