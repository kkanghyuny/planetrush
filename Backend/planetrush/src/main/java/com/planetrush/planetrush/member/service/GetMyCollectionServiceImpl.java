package com.planetrush.planetrush.member.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.planetrush.planetrush.member.domain.ChallengeHistory;
import com.planetrush.planetrush.member.repository.ChallengeHistoryRepository;
import com.planetrush.planetrush.member.service.dto.PlanetCollectionDto;

import lombok.RequiredArgsConstructor;

/**
 * {@inheritDoc}
 *
 * 이 클래스는 GetMyCollectionService 인터페이스를 구현하여 사용자의 완료한 행성 컬렉션을 가져오는 기능을 제공합니다.
 */
@RequiredArgsConstructor
@Service
public class GetMyCollectionServiceImpl implements GetMyCollectionService {

	private final ChallengeHistoryRepository challengeHistoryRepository;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public List<PlanetCollectionDto> getPlanetCollections(Long memberId) {
		List<ChallengeHistory> historyList = challengeHistoryRepository.findByMemberId(memberId)
			.orElseGet(List::of);
		return historyList.stream()
			.map(history -> PlanetCollectionDto.builder()
				.id(history.getId())
				.name(history.getPlanetName())
				.category(history.getCategory())
				.content(history.getChallengeContent())
				.imageUrl(history.getPlanetImgUrl())
				.progress(history.getProgress())
				.build())
			.collect(Collectors.toList());
	}
}
