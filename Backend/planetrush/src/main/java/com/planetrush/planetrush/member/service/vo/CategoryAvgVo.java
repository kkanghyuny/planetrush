package com.planetrush.planetrush.member.service.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CategoryAvgVo {

	private double myAvg;
	private double allAvg;

	public double getRoundedMyAvg() {
		return Math.round(myAvg * 10) / 10.0;
	}

	public double getRoundedAllAvg() {
		return Math.round(allAvg * 10) / 10.0;
	}

}
