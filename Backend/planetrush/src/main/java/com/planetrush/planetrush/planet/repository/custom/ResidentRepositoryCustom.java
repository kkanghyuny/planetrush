package com.planetrush.planetrush.planet.repository.custom;

import static com.planetrush.planetrush.planet.domain.QResident.*;

import org.springframework.stereotype.Repository;

import com.planetrush.planetrush.planet.domain.ChallengerStatus;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class ResidentRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	public Long countCurrentParticipants(Long planetId) {
		return queryFactory.select(resident.count())
			.from(resident)
			.where(planetIdEq(planetId))
			.fetchOne();
	}

	public boolean isResidentOfPlanet(Long memberId, Long planetId) {
		return queryFactory.selectFrom(resident)
			.where(
				memberIdEq(memberId),
				planetIdEq(planetId),
				isReadyStatus()
			)
			.fetchOne() != null;
	}

	private BooleanExpression planetIdEq(Long planetId) {
		return resident.planet.id.eq(planetId);
	}

	private BooleanExpression memberIdEq(Long memberId) {
		return resident.member.id.eq(memberId);
	}

	private BooleanExpression isReadyStatus() {
		return resident.challengerStatus.eq(ChallengerStatus.READY);
	}

}
