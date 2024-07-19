package com.planetrush.planetrush.planet.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.planetrush.planetrush.planet.domain.Planet;
import com.planetrush.planetrush.planet.repository.custom.PlanetRepositoryCustom;
import com.planetrush.planetrush.planet.service.dto.PlanetInfoDto;
import com.planetrush.planetrush.planet.service.dto.SearchCond;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GetPlanetServiceImpl implements GetPlanetService {

	private final PlanetRepositoryCustom planetRepositoryCustom;

	/**
	 * 검색어, 카테고리로 검색, 챌린지 시작 시간이 지나지 않아 참가 가능성이 있는 행성들을 검색할 수 있다.
	 * @param cond  검색 조건
	 * @return 행성 상세정보 목록
	 */
	@Override
	public List<PlanetInfoDto> searchPlanet(SearchCond cond) {
		List<Planet> planets = planetRepositoryCustom.searchPlanet(cond);
		return planets.stream()
			.map(p -> PlanetInfoDto.builder()
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

}
