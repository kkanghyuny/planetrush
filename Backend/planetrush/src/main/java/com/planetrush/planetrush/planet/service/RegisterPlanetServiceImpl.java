package com.planetrush.planetrush.planet.service;

import org.springframework.stereotype.Service;

import com.planetrush.planetrush.image.repository.CustomPlanetImgRepository;
import com.planetrush.planetrush.image.repository.DefaultPlanetImgRepository;
import com.planetrush.planetrush.image.repository.StandardVerificationImgRepository;
import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.member.exception.MemberNotFoundException;
import com.planetrush.planetrush.member.repository.MemberRepository;
import com.planetrush.planetrush.planet.domain.Category;
import com.planetrush.planetrush.planet.domain.Planet;
import com.planetrush.planetrush.planet.domain.Resident;
import com.planetrush.planetrush.planet.domain.image.CustomPlanetImg;
import com.planetrush.planetrush.planet.domain.image.DefaultPlanetImg;
import com.planetrush.planetrush.planet.domain.image.StandardVerificationImg;
import com.planetrush.planetrush.planet.repository.PlanetRepository;
import com.planetrush.planetrush.planet.repository.ResidentRepository;
import com.planetrush.planetrush.planet.service.dto.RegisterPlanetDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RegisterPlanetServiceImpl implements RegisterPlanetService {

	private final PlanetRepository planetRepository;
	private final ResidentRepository residentRepository;
	private final MemberRepository memberRepository;
	private final DefaultPlanetImgRepository defaultPlanetImgRepository;
	private final CustomPlanetImgRepository customPlanetImgRepository;
	private final StandardVerificationImgRepository standardVerificationImgRepository;

	@Override
	public void registerPlanet(RegisterPlanetDto dto) {
		// TODO: error 처리
		DefaultPlanetImg defaultPlanetImg = defaultPlanetImgRepository.getById(dto.getDefaultImgId());
		CustomPlanetImg customPlanetImg =
			dto.getDefaultImgId() == 1 ? customPlanetImgRepository.getById(dto.getCustomPlanetImgId()) : null;
		StandardVerificationImg standardVerificationImg = standardVerificationImgRepository.getById(
			dto.getStandardPlanetImgId());
		Planet planet = planetRepository.save(Planet.builder()
			.name(dto.getName())
			.category(Category.valueOf(dto.getCategory()))
			.content(dto.getContent())
			.startDate(dto.getStartDate())
			.endDate(dto.getEndDate())
			.maxParticipants(dto.getMaxParticipants())
			.verificationCond(dto.getAuthCond())
			.defaultPlanetImg(defaultPlanetImg)
			.customPlanetImg(customPlanetImg)
			.standardVerificationImg(standardVerificationImg)
			.build());
		Member member = memberRepository.findById(dto.getMemberId())
			.orElseThrow(() -> new MemberNotFoundException("Member not found with ID: " + dto.getMemberId()));
		residentRepository.save(Resident.isCreator(member, planet));
	}

}
