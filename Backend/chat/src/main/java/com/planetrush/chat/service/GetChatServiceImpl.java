package com.planetrush.chat.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;

import com.planetrush.chat.repository.ChatRepository;
import com.planetrush.chat.service.dto.GetChatDto;
import com.planetrush.chat.service.dto.MemberDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GetChatServiceImpl implements GetChatService {

	private final ChatRepository chatRepository;
	private final GetNicknameService getNicknameService;
	private final RedisSubscribeListener redisSubscribeListener;
	private final RedisMessageListenerContainer redisMessageListenerContainer;

	/**
	 * {@inheritDoc}
	 * <p>이 메서드는 주어진 행성 ID에 기반하여, 해당 행성과 관련된 모든 채팅 메시지를 작성 시점에 따라 오름차순으로 정렬하여 반환합니다.</p>
	 *
	 * @param planetId 채팅 메시지를 조회할 대상 행성의 ID
	 * @return
	 */
	@Override
	public List<GetChatDto> getChattingMessageByPlanetId(Long planetId) {
		List<GetChatDto> messages = chatRepository.findAllByPlanetIdOrderByCreatedAtAsc(planetId);
		List<MemberDto> memberIds = chatRepository.findMemberIdsByPlanetId(planetId);
		Set<Long> memberIdSet = memberIds.stream()
			.map(MemberDto::getMemberId)
			.collect(Collectors.toSet());
		Map<Long, String> nicknames = getNicknameService.getNicknameByMemberIds(memberIdSet);
		String chatRoom = "planet" + planetId;
		redisMessageListenerContainer.addMessageListener(redisSubscribeListener, new ChannelTopic(chatRoom));
		return messages.stream().map(message -> {
			message.setNicknameByMemberId(nicknames.get(message.getMemberId()));
			return message;
		}).collect(Collectors.toList());
	}

}
