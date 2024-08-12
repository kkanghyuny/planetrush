package com.planetrush.planetrush.member.repository.custom;

import static com.planetrush.planetrush.member.domain.QChallengeHistory.*;
import static com.planetrush.planetrush.member.domain.QProgressAvg.*;

import org.springframework.stereotype.Repository;

import com.planetrush.planetrush.member.domain.ChallengeResult;
import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.member.domain.ProgressAvg;
import com.planetrush.planetrush.member.exception.MemberNotFoundException;
import com.planetrush.planetrush.member.repository.ProgressAvgRepository;
import com.planetrush.planetrush.member.service.dto.AllAvgDto;
import com.planetrush.planetrush.member.service.dto.CategoryPerDto;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class ProgressAvgRepositoryCustom {

	private final JPAQueryFactory queryFactory;
	private final ProgressAvgRepository progressAvgRepository;

	/**
	 * 유저 id를 입력 받아 각 카테고리의 유저의 상위 퍼센트를 구합니다.
	 * @param member 유저 객체
	 * @return 유저의 카테고리별 상위 퍼센트
	 */
	public CategoryPerDto getCategoryPer(Member member) {
		ProgressAvg me = progressAvgRepository.findByMemberId(member.getId());
		if (me == null) {
			throw new MemberNotFoundException("Member not found with id: " + member.getId());
		}
		Long totalCount = fetchCountSafely(
			queryFactory.select(progressAvg.totalAvg.count()).from(progressAvg).fetchOne());
		Long exerciseCount = fetchCountSafely(
			queryFactory.select(progressAvg.exerciseAvg.count()).from(progressAvg).fetchOne());
		Long beautyCount = fetchCountSafely(
			queryFactory.select(progressAvg.beautyAvg.count()).from(progressAvg).fetchOne());
		Long lifeCount = fetchCountSafely(
			queryFactory.select(progressAvg.lifeAvg.count()).from(progressAvg).fetchOne());
		Long studyCount = fetchCountSafely(
			queryFactory.select(progressAvg.studyAvg.count()).from(progressAvg).fetchOne());
		Long etcCount = fetchCountSafely(queryFactory.select(progressAvg.etcAvg.count()).from(progressAvg).fetchOne());
		Double totalAvgValue = me.getTotalAvg() != null ? me.getTotalAvg() : 0.0;
		Double exerciseAvgValue = me.getExerciseAvg() != null ? me.getExerciseAvg() : 0.0;
		Double beautyAvgValue = me.getBeautyAvg() != null ? me.getBeautyAvg() : 0.0;
		Double lifeAvgValue = me.getLifeAvg() != null ? me.getLifeAvg() : 0.0;
		Double studyAvgValue = me.getStudyAvg() != null ? me.getStudyAvg() : 0.0;
		Double etcAvgValue = me.getEtcAvg() != null ? me.getEtcAvg() : 0.0;
		Long totalTopCount = fetchCountSafely(queryFactory
			.select(progressAvg.totalAvg.count())
			.from(progressAvg)
			.where(progressAvg.totalAvg.goe(totalAvgValue))
			.fetchOne());
		Long exerciseTopCount = fetchCountSafely(queryFactory
			.select(progressAvg.exerciseAvg.count())
			.from(progressAvg)
			.where(progressAvg.exerciseAvg.goe(exerciseAvgValue))
			.fetchOne());
		Long beautyTopCount = fetchCountSafely(queryFactory
			.select(progressAvg.beautyAvg.count())
			.from(progressAvg)
			.where(progressAvg.beautyAvg.goe(beautyAvgValue))
			.fetchOne());
		Long lifeTopCount = fetchCountSafely(queryFactory
			.select(progressAvg.lifeAvg.count())
			.from(progressAvg)
			.where(progressAvg.lifeAvg.goe(lifeAvgValue))
			.fetchOne());
		Long studyTopCount = fetchCountSafely(queryFactory
			.select(progressAvg.studyAvg.count())
			.from(progressAvg)
			.where(progressAvg.studyAvg.goe(studyAvgValue))
			.fetchOne());
		Long etcTopCount = fetchCountSafely(queryFactory
			.select(progressAvg.etcAvg.count())
			.from(progressAvg)
			.where(progressAvg.etcAvg.goe(etcAvgValue))
			.fetchOne());
		double myTotalPer = calculatePercentage(totalTopCount, totalCount, totalAvgValue);
		double myExercisePer = calculatePercentage(exerciseTopCount, exerciseCount, exerciseAvgValue);
		double myBeautyPer = calculatePercentage(beautyTopCount, beautyCount, beautyAvgValue);
		double myLifePer = calculatePercentage(lifeTopCount, lifeCount, lifeAvgValue);
		double myStudyPer = calculatePercentage(studyTopCount, studyCount, studyAvgValue);
		double myEtcPer = calculatePercentage(etcTopCount, etcCount, etcAvgValue);
		return CategoryPerDto.builder()
			.myTotalPer(myTotalPer)
			.myExercisePer(myExercisePer)
			.myBeautyPer(myBeautyPer)
			.myLifePer(myLifePer)
			.myStudyPer(myStudyPer)
			.myEtcPer(myEtcPer)
			.build();
	}

	/**
	 * 카테고리별 모든 유저의 평균을 구합니다.
	 * @return 카테고리별 평균
	 */
	public AllAvgDto getAllAvg() {
		Tuple result = queryFactory
			.select(
				progressAvg.totalAvg.avg(),
				progressAvg.exerciseAvg.avg(),
				progressAvg.beautyAvg.avg(),
				progressAvg.lifeAvg.avg(),
				progressAvg.studyAvg.avg(),
				progressAvg.etcAvg.avg()
			)
			.from(progressAvg)
			.fetchOne();
		if (result == null) {
			return AllAvgDto.builder()
				.totalAvg(0.0)
				.exerciseAvg(0.0)
				.beautyAvg(0.0)
				.lifeAvg(0.0)
				.studyAvg(0.0)
				.etcAvg(0.0)
				.build();
		}
		Double totalAvg = result.get(0, Double.class);
		Double exerciseAvg = result.get(1, Double.class);
		Double beautyAvg = result.get(2, Double.class);
		Double lifeAvg = result.get(3, Double.class);
		Double studyAvg = result.get(4, Double.class);
		Double etcAvg = result.get(5, Double.class);
		return AllAvgDto.builder()
			.totalAvg(totalAvg != null ? totalAvg : 0.0)
			.exerciseAvg(exerciseAvg != null ? exerciseAvg : 0.0)
			.beautyAvg(beautyAvg != null ? beautyAvg : 0.0)
			.lifeAvg(lifeAvg != null ? lifeAvg : 0.0)
			.studyAvg(studyAvg != null ? studyAvg : 0.0)
			.etcAvg(etcAvg != null ? etcAvg : 0.0)
			.build();
	}

	/**
	 * count가 null이면 0으로 변환합니다.
	 * @param count 개수
	 * @return 개수
	 */
	private Long fetchCountSafely(Long count) {
		return count != null ? count : 0L;
	}

	/**
	 * 퍼센트를 계산합니다.
	 * @param count 상위 개수
	 * @param totalCount 전체 개수
	 * @param avg 평균
	 * @return 상위 퍼센트
	 */
	private double calculatePercentage(Long count, Long totalCount, Double avg) {
		if (count == 0 || totalCount == 0 || avg == 0) {
			return 0;
		}
		return (double)count / totalCount * 100;
	}

	/**
	 * 유저가 완료한 행성의 개수를 반환합니다.
	 * @param member 유저 객체
	 * @return 완료한 행성의 개수
	 */
	public Long getCompletionCount(Member member) {
		Long challengeCount = queryFactory
			.select(challengeHistory.count())
			.from(challengeHistory)
			.where(challengeHistory.member.eq(member),
				challengeHistory.result.in(ChallengeResult.SUCCESS))
			.fetchOne();
		return (challengeCount != null) ? challengeCount : 0L;
	}

	/**
	 * 유저가 도전했던 행성의 개수를 반환합니다.
	 * @param member 유저 객체
	 * @return 유저가 도전했던 행성의 개수
	 */
	public Long getChallengeCount(Member member) {
		Long challengeCount = queryFactory
			.select(challengeHistory.count())
			.from(challengeHistory)
			.where(challengeHistory.member.eq(member))
			.fetchOne();
		return (challengeCount != null) ? challengeCount : 0L;
	}

	public void updateProgressAvg(Long memberId, ProgressAvg newProgressAvg) {
		queryFactory.update(progressAvg)
			.set(progressAvg.beautyAvg, newProgressAvg.getBeautyAvg())
			.set(progressAvg.exerciseAvg, newProgressAvg.getExerciseAvg())
			.set(progressAvg.lifeAvg, newProgressAvg.getLifeAvg())
			.set(progressAvg.studyAvg, newProgressAvg.getStudyAvg())
			.set(progressAvg.etcAvg, newProgressAvg.getEtcAvg())
			.set(progressAvg.totalAvg, newProgressAvg.getTotalAvg())
			.where(progressAvg.member.id.eq(memberId))
			.execute();
	}

}
