package com.planetrush.planetrush.member.repository.custom;

import static com.planetrush.planetrush.member.domain.QChallengeHistory.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.planetrush.planetrush.planet.domain.Category;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class ChallengeHistoryRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	/**
	 * 회원별 챌린지 진행률의 평균을 계산합니다.
	 *
	 * @return 회원 id를 기준으로 카테고리별 평균 진행률
	 */
	public Map<Long, Map<Category, Double>> getAverageScoreByMember() {

		List<Tuple> result = queryFactory
			.select(
				challengeHistory.member.id,
				challengeHistory.category,
				challengeHistory.progress.avg()
			)
			.from(challengeHistory)
			.groupBy(challengeHistory.member.id, challengeHistory.category)
			.fetch();
		return result.stream()
			.collect(Collectors.groupingBy(
				tuple -> tuple.get(challengeHistory.member.id),
				Collectors.toMap(
					tuple -> tuple.get(challengeHistory.category),
					tuple -> tuple.get(challengeHistory.progress.avg())
				)
			));
	}

}
