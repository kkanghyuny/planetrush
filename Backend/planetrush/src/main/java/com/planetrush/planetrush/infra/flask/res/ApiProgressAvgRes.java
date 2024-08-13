package com.planetrush.planetrush.infra.flask.res;

import com.planetrush.planetrush.member.service.dto.GetMyProgressAvgDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ApiProgressAvgRes {

	private String code;
	private String message;
	private boolean isSuccess;
	private GetMyProgressAvgDto data;

}
