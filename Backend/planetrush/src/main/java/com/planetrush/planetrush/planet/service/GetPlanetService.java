package com.planetrush.planetrush.planet.service;

import java.util.List;

import com.planetrush.planetrush.planet.service.dto.PlanetInfoDto;
import com.planetrush.planetrush.planet.service.dto.SearchCond;

public interface GetPlanetService {

	List<PlanetInfoDto> searchPlanet(SearchCond cond);

}
