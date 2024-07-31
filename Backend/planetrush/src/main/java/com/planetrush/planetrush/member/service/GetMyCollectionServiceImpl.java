package com.planetrush.planetrush.member.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.planetrush.planetrush.member.domain.ChallengeHistory;
import com.planetrush.planetrush.member.repository.ChallengeHistoryRepository;
import com.planetrush.planetrush.member.service.dto.PlanetCollectionDto;

import lombok.RequiredArgsConstructor;

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
				.planetId(history.getId())
				.name(history.getPlanetName())
				.category(history.getCategory())
				.content(history.getChallengeContent())
				.imageUrl(history.getPlanetImgUrl())
				.progress(history.getProgress())
				.build())
			.collect(Collectors.toList());
	}
}
