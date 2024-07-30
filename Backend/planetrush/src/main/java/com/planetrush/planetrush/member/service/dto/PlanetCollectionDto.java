package com.planetrush.planetrush.member.service.dto;

import com.planetrush.planetrush.planet.domain.Category;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PlanetCollectionDto {

	private long id;
	private String name;
	private Category category;
	private String content;
	private String imageUrl;
	private double progress;
}
