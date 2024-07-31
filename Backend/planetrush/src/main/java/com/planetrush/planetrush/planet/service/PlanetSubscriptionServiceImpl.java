package com.planetrush.planetrush.planet.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.member.exception.MemberNotFoundException;
import com.planetrush.planetrush.member.repository.MemberRepository;
import com.planetrush.planetrush.planet.domain.Planet;
import com.planetrush.planetrush.planet.domain.Resident;
import com.planetrush.planetrush.planet.exception.PlanetNotFoundException;
import com.planetrush.planetrush.planet.exception.ResidentAlreadyExistsException;
import com.planetrush.planetrush.planet.exception.ResidentNotFoundException;
import com.planetrush.planetrush.planet.repository.PlanetRepository;
import com.planetrush.planetrush.planet.repository.ResidentRepository;
import com.planetrush.planetrush.planet.service.dto.PlanetSubscriptionDto;

import lombok.RequiredArgsConstructor;

@Transactional
@RequiredArgsConstructor
@Service
public class PlanetSubscriptionServiceImpl implements PlanetSubscriptionService {

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
	public void registerResident(PlanetSubscriptionDto dto) {
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

	/**
	 * {@inheritDoc}
	 *
	 * 이 메서드는 데이터베이스에서 입주 정보를 삭제합니다.
	 * @param dto 사용자의 id, 행성의 id 등을 포함합니다.
	 */
	@Override
	public void deleteResident(PlanetSubscriptionDto dto) {
		Resident resident = residentRepository.findByMemberIdAndPlanetId(dto.getMemberId(), dto.getPlanetId())
			.orElseThrow(() -> new ResidentNotFoundException(
				"resident not found member id: " + dto.getMemberId() + " and planet id: " + dto.getPlanetId()));
		Planet planet = planetRepository.findById(dto.getPlanetId())
			.orElseThrow(() -> new PlanetNotFoundException("planet not found id: " + dto.getPlanetId()));
		planet.removeParticipant();
		residentRepository.delete(resident);
	}
}
