package com.planetrush.planetrush.member.service;

import java.util.List;

import com.planetrush.planetrush.member.service.dto.PlanetCollectionDto;

/**
 * 이 인터페이스는 사용자의 완료한 행성 컬렉션을 가져오는 기능을 정의합니다.
 */
public interface GetMyCollectionService {

	/**
	 * 주어진 memberId를 사용하여 완료한 행성의 기록을 검색합니다.
	 * @param memberId 검색하고자 하는 member의 고유 id입니다.
	 * @return 컬렉션 리스트를 반환합니다.
	 */
	List<PlanetCollectionDto> getPlanetCollections(Long memberId);
}