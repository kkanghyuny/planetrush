package com.planetrush.planetrush.planet.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planetrush.planetrush.core.jwt.JwtTokenProvider;
import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.member.exception.MemberNotFoundException;
import com.planetrush.planetrush.member.repository.MemberRepository;
import com.planetrush.planetrush.planet.domain.Planet;
import com.planetrush.planetrush.planet.exception.PlanetNotFoundException;
import com.planetrush.planetrush.planet.repository.PlanetRepository;
import com.planetrush.planetrush.planet.repository.custom.PlanetRepositoryCustom;
import com.planetrush.planetrush.planet.repository.custom.ResidentRepositoryCustom;
import com.planetrush.planetrush.planet.service.dto.PlanetDetailDto;
import com.planetrush.planetrush.planet.service.dto.SearchCond;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class GetPlanetServiceImpl implements GetPlanetService {

	private final JwtTokenProvider jwtTokenProvider;
	private final MemberRepository memberRepository;
	private final PlanetRepository planetRepository;
	private final ResidentRepositoryCustom residentRepositoryCustom;
	private final PlanetRepositoryCustom planetRepositoryCustom;

	/**
	 * 검색어, 카테고리로 검색, 챌린지 시작 시간이 지나지 않아 참가 가능성이 있는 행성들을 검색할 수 있다.
	 * @param cond  검색 조건
	 * @return 행성 상세정보 목록
	 */
	@Override
	public List<PlanetDetailDto> searchPlanet(SearchCond cond) {
		List<Planet> planets = planetRepositoryCustom.searchPlanet(cond);
		return planets.stream()
			.map(p -> PlanetDetailDto.builder()
				.planetId(p.getId())
				.name(p.getName())
				.planetImg(null)  // TODO: 행성 이미지 URL 추가할 것
				.content(p.getContent())
				.startDate(p.getStartDate())
				.endDate(p.getEndDate())
				.category(String.valueOf(p.getCategory()))
				.maxParticipants(p.getMaxParticipants())
				.currentParticipants(p.getCurrentParticipants())
				.planetStatus(p.getStatus().toString())
				.build())
			.toList();
	}

	/**
	 * 챌린지가 시작되지 않은 행성 상세 조회한다.
	 * @param memberId 회원 id
	 * @param planetId 행성 id
	 * @return 행성 상세 정보
	 */
	@Override
	public PlanetDetailDto getPlanetDetail(Long memberId, Long planetId) {
		Planet planet = planetRepository.findById(planetId)
			.orElseThrow(PlanetNotFoundException::new);
		boolean joined = false;
		if (isNotNull(memberId)) {
			Member member = memberRepository.findById(memberId)
				.orElseThrow(MemberNotFoundException::new);  // TODO: Member 조회 HelperService로 대체할 것
			joined = residentRepositoryCustom.isResidentOfPlanet(memberId, planetId);
		}
		return PlanetDetailDto.builder()
			.planetId(planet.getId())
			.name(planet.getName())
			.planetImg(null)  // TODO: 행성 이미지 URL 추가할 것
			.content(planet.getContent())
			.startDate(planet.getStartDate())
			.endDate(planet.getEndDate())
			.category(String.valueOf(planet.getCategory()))
			.maxParticipants(planet.getMaxParticipants())
			.currentParticipants(planet.getCurrentParticipants())
			.planetStatus(String.valueOf(planet.getStatus()))
			.joined(joined)
			.build();
	}

	private boolean isNotNull(Long memberId) {
		return memberId != null;
	}

}
