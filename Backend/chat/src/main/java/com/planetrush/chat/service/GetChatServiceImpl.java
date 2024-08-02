package com.planetrush.chat.service;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.planetrush.chat.domain.ChattingMessage;
import com.planetrush.chat.repository.ChatRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GetChatServiceImpl implements GetChatService {

	private final ChatRepository chatRepository;

	/**
	 * {@inheritDoc}
	 * <p>이 메서드는 주어진 행성 ID에 기반하여, 해당 행성과 관련된 모든 채팅 메시지를 작성 시점에 따라 오름차순으로 정렬하여 반환합니다.</p>
	 *
	 * @param planetId 채팅 메시지를 조회할 대상 행성의 ID
	 * @return
	 */
	@Override
	public List<ChattingMessage> getChattingMessageByPlanetId(Long planetId) {
		return chatRepository.findAllByPlanetIdOrderByCreatedAtAsc(planetId);
	}
}
