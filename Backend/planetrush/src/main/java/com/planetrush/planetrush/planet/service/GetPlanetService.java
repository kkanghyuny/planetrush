package com.planetrush.planetrush.planet.service;

import java.util.List;

import com.planetrush.planetrush.planet.service.dto.OngoingPlanetDto;
import com.planetrush.planetrush.planet.service.dto.PlanetDetailDto;
import com.planetrush.planetrush.planet.service.dto.SearchCond;

public interface GetPlanetService {

	List<PlanetDetailDto> searchPlanet(SearchCond cond);

	PlanetDetailDto getPlanetDetail(Long memberId, Long planetId);

	/**
	 * 현재 진행 중인 행성의 상세 정보를 조회합니다.
	 *
	 * @param memberId
	 * @param planetId 조회 행성 id
	 * @return 현재 진행 중인 행성의 상세 정보가 담긴 객체
	 */
	OngoingPlanetDto getOngoingPlanet(Long memberId, Long planetId);

}
