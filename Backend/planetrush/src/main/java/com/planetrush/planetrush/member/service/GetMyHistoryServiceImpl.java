package com.planetrush.planetrush.member.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.member.exception.MemberNotFoundException;
import com.planetrush.planetrush.member.repository.MemberRepository;
import com.planetrush.planetrush.member.repository.custom.HistoryRepositoryCustom;
import com.planetrush.planetrush.member.service.dto.GetMyHistoryDto;
import com.planetrush.planetrush.member.service.vo.CategoryAvgVo;
import com.planetrush.planetrush.planet.domain.Category;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class GetMyHistoryServiceImpl implements GetMyHistoryService {

	private final MemberRepository memberRepository;
	private final HistoryRepositoryCustom historyRepositoryCustom;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public GetMyHistoryDto getMyHistory(Long memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new MemberNotFoundException("Member not found with ID: " + memberId));
		Long completionCnt = historyRepositoryCustom.getCompletionCount(member);
		Long challengeCnt = historyRepositoryCustom.getChallengeCount(member);
		CategoryAvgVo allAvg = historyRepositoryCustom.getCategoryStats(member, null);
		CategoryAvgVo exerciseAvg = historyRepositoryCustom.getCategoryStats(member, Category.EXERCISE);
		CategoryAvgVo beautyAvg = historyRepositoryCustom.getCategoryStats(member, Category.BEAUTY);
		CategoryAvgVo lifeAvg = historyRepositoryCustom.getCategoryStats(member, Category.LIFE);
		CategoryAvgVo studyAvg = historyRepositoryCustom.getCategoryStats(member, Category.STUDY);
		CategoryAvgVo etcAvg = historyRepositoryCustom.getCategoryStats(member, Category.ETC);
		return GetMyHistoryDto.builder()
			.completionCnt(completionCnt)
			.challengeCnt(challengeCnt)
			.myAllAvg(allAvg.getRoundedMyAvg())
			.allAvg(allAvg.getRoundedAllAvg())
			.myExerciseAvg(exerciseAvg.getRoundedMyAvg())
			.exerciseAvg(exerciseAvg.getRoundedAllAvg())
			.myBeautyAvg(beautyAvg.getRoundedMyAvg())
			.beautyAvg(beautyAvg.getRoundedAllAvg())
			.myLifeAvg(lifeAvg.getRoundedMyAvg())
			.lifeAvg(lifeAvg.getRoundedAllAvg())
			.myStudyAvg(studyAvg.getRoundedMyAvg())
			.studyAvg(studyAvg.getRoundedAllAvg())
			.myEtcAvg(etcAvg.getRoundedMyAvg())
			.etcAvg(etcAvg.getRoundedAllAvg())
			.build();
	}

}
