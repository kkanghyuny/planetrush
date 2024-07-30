package com.planetrush.planetrush.planet.repository.custom;

import static com.planetrush.planetrush.planet.domain.QVerificationRecord.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.planetrush.planetrush.planet.domain.VerificationRecord;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class VerificationRecordRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	public List<VerificationRecord> findVerificationRecordsByMemberIdAndPlanetId(Long memberId, Long planetId) {
		return queryFactory.selectFrom(verificationRecord)
			.where(
				memberIdeq(memberId),
				planetIdeq(planetId),
				isVerified()
			)
			.fetch();
	}

	private BooleanExpression isVerified() {
		return verificationRecord.verified.isTrue();
	}

	private BooleanExpression planetIdeq(Long planetId) {
		return verificationRecord.planet.id.eq(planetId);
	}

	private BooleanExpression memberIdeq(Long memberId) {
		return verificationRecord.member.id.eq(memberId);
	}

}

