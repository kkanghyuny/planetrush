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

/**
 * {@inheritDoc}
 *
 * 이 클래스는 RegisterResidentService 인터페이스를 구현하여 행성 입주 신청 기능을 제공합니다.
 */
@RequiredArgsConstructor
@Service
public class RegisterResidentServiceImpl implements RegisterResidentService {

	private final MemberRepository memberRepository;
	private final PlanetRepository planetRepository;
	private final ResidentRepository residentRepository;

	/**
	 * {@inheritDoc}
	 *
	 * 이 메서드는 데이터베이스에 입주기록을 등록합니다.
	 * @param dto 사용자의 id, 행성의 id 등을 포함합니다.
	 */
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
