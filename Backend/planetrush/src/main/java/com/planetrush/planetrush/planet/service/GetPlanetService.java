package com.planetrush.planetrush.planet.service;

import java.util.List;

import com.planetrush.planetrush.planet.service.dto.PlanetDetailDto;
import com.planetrush.planetrush.planet.service.dto.SearchCond;

public interface GetPlanetService {

	List<PlanetDetailDto> searchPlanet(SearchCond cond);

	PlanetDetailDto getPlanetDetail(String accessToken, Long planetId);

}
