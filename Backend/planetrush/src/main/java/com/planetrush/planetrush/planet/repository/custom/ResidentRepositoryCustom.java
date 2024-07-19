package com.planetrush.planetrush.planet.repository.custom;

import static com.planetrush.planetrush.planet.domain.QResident.*;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class ResidentRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	public Long countCurrentParticipants(long planetId) {
		return queryFactory.select(resident.count())
			.from(resident)
			.where(resident.planet.id.eq(planetId))
			.fetchOne();
	}

}
