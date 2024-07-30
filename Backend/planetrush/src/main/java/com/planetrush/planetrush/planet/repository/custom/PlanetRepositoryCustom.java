package com.planetrush.planetrush.planet.repository.custom;

import static com.planetrush.planetrush.planet.domain.QPlanet.*;
import static com.planetrush.planetrush.planet.domain.QResident.*;
import static com.planetrush.planetrush.planet.domain.QVerificationRecord.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.planetrush.planetrush.planet.domain.ChallengerStatus;
import com.planetrush.planetrush.planet.domain.Planet;
import com.planetrush.planetrush.planet.domain.PlanetStatus;
import com.planetrush.planetrush.planet.service.dto.GetMainPlanetListDto;
import com.planetrush.planetrush.planet.service.dto.GetMyPlanetListDto;
import com.planetrush.planetrush.planet.service.dto.SearchCond;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
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

	public List<GetMyPlanetListDto> getMyPlanetList(Long memberId) {
		return queryFactory.select(Projections.constructor(GetMyPlanetListDto.class,
				planet.id,
				planet.planetImg,
				planet.category.stringValue(),
				planet.name,
				planet.content,
				planet.startDate,
				planet.endDate,
				planet.currentParticipants,
				planet.maxParticipants,
				planet.status.stringValue()
			))
			.from(resident)
			.join(resident.planet, planet)
			.where(
				resident.member.id.eq(memberId),
				resident.challengerStatus.in(ChallengerStatus.READY, ChallengerStatus.IN_PROGRESS)
			)
			.fetch();
	}

	public List<GetMainPlanetListDto> getMainPlanetList(Long memberId) {
		return queryFactory.select(Projections.constructor(GetMainPlanetListDto.class,
				planet.id,
				planet.planetImg,
				planet.name,
				planet.status.stringValue(),
				ExpressionUtils.as(
					queryFactory.select(verificationRecord.uploadDate.max())
						.from(verificationRecord)
						.where(verificationRecord.planet.eq(planet)
							.and(verificationRecord.member.id.eq(memberId))
							.and(verificationRecord.verified.isTrue()))
						.loe(LocalDateTime.now().minusDays(2).withHour(0).withMinute(0).withSecond(0).withNano(0)),
					"isLastDay"
				)
			))
			.from(resident)
			.join(resident.planet, planet)
			.where(
				resident.member.id.eq(memberId),
				resident.challengerStatus.in(ChallengerStatus.READY, ChallengerStatus.IN_PROGRESS)
			)
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
