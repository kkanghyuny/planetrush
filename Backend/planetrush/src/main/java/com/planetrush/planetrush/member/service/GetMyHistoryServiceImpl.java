package com.planetrush.planetrush.member.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planetrush.planetrush.member.repository.custom.HistoryRepositoryCustom;
import com.planetrush.planetrush.member.service.dto.GetMyHistoryDto;
import com.planetrush.planetrush.member.service.vo.CategoryAvgVo;
import com.planetrush.planetrush.planet.domain.Category;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class GetMyHistoryServiceImpl implements GetMyHistoryService {

	private final HistoryRepositoryCustom historyRepositoryCustom;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public GetMyHistoryDto getMyHistory(Long memberId) {
		Long completionCnt = historyRepositoryCustom.getCompletionCount(memberId);
		Long challengeCnt = historyRepositoryCustom.getChallengeCount(memberId);
		CategoryAvgVo allAvgs = historyRepositoryCustom.getCategoryStats(memberId, null);
		CategoryAvgVo exerciseAvgs = historyRepositoryCustom.getCategoryStats(memberId, Category.EXERCISE);
		CategoryAvgVo beautyAvgs = historyRepositoryCustom.getCategoryStats(memberId, Category.BEAUTY);
		CategoryAvgVo lifeAvgs = historyRepositoryCustom.getCategoryStats(memberId, Category.LIFE);
		CategoryAvgVo studyAvgs = historyRepositoryCustom.getCategoryStats(memberId, Category.STUDY);
		CategoryAvgVo etcAvgs = historyRepositoryCustom.getCategoryStats(memberId, Category.ETC);
		return GetMyHistoryDto.builder()
			.completionRate((int)allAvgs.getMyAvg())
			.completionCnt(completionCnt)
			.challengeCnt(challengeCnt)
			.myAllAvg(allAvgs.getRoundedMyAvg())
			.allAvg(allAvgs.getRoundedAllAvg())
			.myExerciseAvg(exerciseAvgs.getRoundedMyAvg())
			.exerciseAvg(exerciseAvgs.getRoundedAllAvg())
			.myBeautyAvg(beautyAvgs.getRoundedMyAvg())
			.beautyAvg(beautyAvgs.getRoundedAllAvg())
			.myLifeAvg(lifeAvgs.getRoundedMyAvg())
			.lifeAvg(lifeAvgs.getRoundedAllAvg())
			.myStudyAvg(studyAvgs.getRoundedMyAvg())
			.studyAvg(studyAvgs.getRoundedAllAvg())
			.myEtcAvg(etcAvgs.getRoundedMyAvg())
			.etcAvg(etcAvgs.getRoundedAllAvg())
			.build();
	}

}
