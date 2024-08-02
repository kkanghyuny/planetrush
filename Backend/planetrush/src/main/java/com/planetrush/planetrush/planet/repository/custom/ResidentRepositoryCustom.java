package com.planetrush.planetrush.planet.repository.custom;

import static com.planetrush.planetrush.planet.domain.QResident.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.planet.domain.Planet;
import com.planetrush.planetrush.planet.domain.Resident;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class ResidentRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	/**
	 * 유저가 행성에 참여한 상태인지 확인합니다.
	 * @param memberId 유저의 고유 id
	 * @param planetId 행성의 고유 id
	 * @return 참여 여부
	 */
	public boolean isResidentOfPlanet(Long memberId, Long planetId) {
		return queryFactory.selectFrom(resident)
			.where(
				memberIdEq(memberId),
				planetIdEq(planetId)
			)
			.fetchOne() != null;
	}

	/**
	 * 현재 참여중이며 퇴출 당하지 않은 기록을 확인합니다.
	 * @param planetId 행성의 고유 id
	 * @return 참여 기록
	 */
	public List<Resident> getResidentsNotBanned(Long planetId) {
		return queryFactory.selectFrom(resident)
			.where(
				planetIdEq(planetId),
				isNotBanned()
			)
			.fetch();
	}

	/**
	 * 챌린지가 진행중인 행성의 참가자 중, 마지막 인증이 3일 전인 경우 해당 회원은 제거됩니다.
	 */
	public void banMemberFromPlanet(Member member, Planet planet) {
		queryFactory.update(resident)
			.set(resident.banned, true)
			.where(resident.member.eq(member),
				resident.planet.eq(planet))
			.execute();
	}

	private BooleanExpression planetIdEq(Long planetId) {
		return resident.planet.id.eq(planetId);
	}

	private BooleanExpression memberIdEq(Long memberId) {
		return memberId != null ? resident.member.id.eq(memberId) : null;
	}

	private BooleanExpression isNotBanned() {
		return resident.banned.isFalse();
	}
	
}
