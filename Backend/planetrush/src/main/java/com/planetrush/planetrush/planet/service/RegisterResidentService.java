package com.planetrush.planetrush.planet.service;

import com.planetrush.planetrush.planet.service.dto.RegisterResidentDto;

/**
 * 이 인터페이스는 행성 입주 신청 기능을 정의합니다.
 * 사용자의 행성 입주 기능이 있습니다.
 */
public interface RegisterResidentService {

	/**
	 * 주어진 dto를 사용하여 입주 기록을 생성합니다.
	 * @param dto 사용자의 id, 행성의 id 등을 포함합니다.
	 */
	void registerResident(RegisterResidentDto dto);
}
