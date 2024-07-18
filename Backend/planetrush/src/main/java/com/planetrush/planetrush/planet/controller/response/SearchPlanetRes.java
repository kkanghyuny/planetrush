package com.planetrush.planetrush.planet.controller.response;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.planetrush.planetrush.planet.service.dto.PlanetInfoDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SearchPlanetRes {

	private List<PlanetInfoDto> planets = new ArrayList<>();
	@JsonProperty(value = "hasNext")
	private boolean hasNext;

}
