package com.planetrush.chat.service;

import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import com.planetrush.chat.service.dto.SendChatDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisPubServiceImpl implements RedisPubService {

	private final RedisPublisher redisPublisher;

	/**
	 * 채널 별 메시지 전송
	 * @param dto 발행할 채팅 메시지의 정보객체
	 */
	public void pubMsgChannel(SendChatDto dto) {
		String chatRoom = "planet" + dto.getPlanetId();
		redisPublisher.publish(new ChannelTopic(chatRoom), dto);
	}
}
