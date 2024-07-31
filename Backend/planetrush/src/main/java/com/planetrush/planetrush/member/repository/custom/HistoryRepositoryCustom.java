package com.planetrush.planetrush.member.repository.custom;

import static com.planetrush.planetrush.member.domain.QChallengeHistory.*;
import static com.planetrush.planetrush.planet.domain.QResident.*;

import org.springframework.stereotype.Repository;

import com.planetrush.planetrush.member.service.vo.CategoryAvgVo;
import com.planetrush.planetrush.planet.domain.Category;
import com.planetrush.planetrush.planet.domain.ChallengerStatus;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class HistoryRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	public CategoryAvgVo getCategoryStats(Long memberId, Category category) {
		return queryFactory
			.select(Projections.constructor(CategoryAvgVo.class,
				JPAExpressions
					.select(challengeHistory.progress.avg().as("myAvg"))
					.from(challengeHistory)
					.where(
						challengeHistory.member.id.eq(memberId).and((category != null) ? challengeHistory.category.eq(category) : null)),
				challengeHistory.progress.avg().as("allAvg")
			))
			.from(challengeHistory)
			.where((category != null) ? challengeHistory.category.eq(category) : null)
			.fetchOne();
	}

	public Long getCompletionCount(Long memberId) {
		Long challengeCount = queryFactory
			.select(challengeHistory.count())
			.from(challengeHistory)
			.where(challengeHistory.member.id.eq(memberId))
			.fetchOne();
		return (challengeCount != null) ? challengeCount : 0L;
	}

	public Long getChallengeCount(Long memberId) {
		Long challengeCount = queryFactory
			.select(resident.count())
			.from(resident)
			.where(resident.member.id.eq(memberId)
				.and(resident.challengerStatus.in(ChallengerStatus.COMPLETED, ChallengerStatus.FAIL)))
			.fetchOne();
		return (challengeCount != null) ? challengeCount : 0L;
	}

}
