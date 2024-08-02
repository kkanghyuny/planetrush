package com.planetrush.planetrush.member.service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class GetMyHistoryDto {

	private long completionCnt;
	private long challengeCnt;
	private double myAllAvg;
	private double allAvg;
	private double myExerciseAvg;
	private double exerciseAvg;
	private double myBeautyAvg;
	private double beautyAvg;
	private double myLifeAvg;
	private double lifeAvg;
	private double myStudyAvg;
	private double studyAvg;
	private double myEtcAvg;
	private double etcAvg;

}
