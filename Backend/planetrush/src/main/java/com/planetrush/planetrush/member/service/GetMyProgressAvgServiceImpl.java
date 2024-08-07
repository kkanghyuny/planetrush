package com.planetrush.planetrush.member.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.member.domain.ProgressAvg;
import com.planetrush.planetrush.member.exception.MemberNotFoundException;
import com.planetrush.planetrush.member.repository.MemberRepository;
import com.planetrush.planetrush.member.repository.ProgressAvgRepository;
import com.planetrush.planetrush.member.repository.custom.ProgressAvgRepositoryCustom;
import com.planetrush.planetrush.member.service.dto.AllAvgDto;
import com.planetrush.planetrush.member.service.dto.GetMyProgressAvgDto;
import com.planetrush.planetrush.member.service.dto.CategoryPerDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class GetMyProgressAvgServiceImpl implements GetMyProgressAvgService {

	private final MemberRepository memberRepository;
	private final ProgressAvgRepositoryCustom progressAvgRepositoryCustom;
	private final ProgressAvgRepository progressAvgRepository;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public GetMyProgressAvgDto getMyProgressAvgPer(Long memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new MemberNotFoundException("Member not found with ID: " + memberId));
		Long completionCnt = progressAvgRepositoryCustom.getCompletionCount(member);
		Long challengeCnt = progressAvgRepositoryCustom.getChallengeCount(member);
		ProgressAvg myProgressAvg = progressAvgRepository.findByMemberId(memberId);
		CategoryPerDto categoryPer = progressAvgRepositoryCustom.getCategoryPer(member);
		AllAvgDto allAvg = progressAvgRepositoryCustom.getAllAvg();
		return GetMyProgressAvgDto.builder()
			.completionCnt(completionCnt)
			.challengeCnt(challengeCnt)
			.myTotalAvg(nullToZero(myProgressAvg.getTotalAvg()))
			.myExerciseAvg(nullToZero(myProgressAvg.getExerciseAvg()))
			.myBeautyAvg(nullToZero(myProgressAvg.getBeautyAvg()))
			.myLifeAvg(nullToZero(myProgressAvg.getLifeAvg()))
			.myStudyAvg(nullToZero(myProgressAvg.getStudyAvg()))
			.myEtcAvg(nullToZero(myProgressAvg.getEtcAvg()))
			.myTotalPer(categoryPer.getMyTotalPer())
			.myExercisePer(categoryPer.getMyExercisePer())
			.myBeautyPer(categoryPer.getMyBeautyPer())
			.myLifePer(categoryPer.getMyLifePer())
			.myStudyPer(categoryPer.getMyStudyPer())
			.myEtcPer(categoryPer.getMyEtcPer())
			.totalAvg(allAvg.getTotalAvg())
			.exerciseAvg(allAvg.getExerciseAvg())
			.beautyAvg(allAvg.getBeautyAvg())
			.lifeAvg(allAvg.getLifeAvg())
			.studyAvg(allAvg.getStudyAvg())
			.etcAvg(allAvg.getEtcAvg())
			.build();
	}

	/**
	 * null을 0으로 처리합니다.
	 * @param value avg
	 * @return avg
	 */
	public Double nullToZero(Double value) {
		return value != null ? value : 0.0;
	}

}
