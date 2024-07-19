package com.planetrush.planetrush.planet.repository.custom;

import static com.planetrush.planetrush.planet.domain.QPlanet.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.planetrush.planetrush.planet.domain.Planet;
import com.planetrush.planetrush.planet.domain.PlanetStatus;
import com.planetrush.planetrush.planet.service.dto.SearchCond;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class PlanetRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	public List<Planet> searchPlanet(SearchCond cond) {
		return queryFactory.selectFrom(planet)
			.where(
				isReadyStatus(),
				isKeywordContained(cond.getKeyword()),
				ltPlanetId(cond.getLastPlanetId()),
				isInCategory(cond.getCategory()))
			.orderBy(planet.id.desc())
			.limit(cond.getSize())
			.fetch();
	}

	private BooleanExpression isReadyStatus() {
		return planet.status.eq(PlanetStatus.READY);
	}

	private BooleanExpression isKeywordContained(String keyword) {
		return keyword != null ? planet.content.contains(keyword) : null;
	}

	private BooleanExpression ltPlanetId(Long lastPlanetId) {
		return lastPlanetId != null ? planet.id.lt(lastPlanetId) : null;
	}

	private BooleanExpression isInCategory(String category) {
		return category != null ? planet.category.stringValue().eq(category) : null;
	}

}
