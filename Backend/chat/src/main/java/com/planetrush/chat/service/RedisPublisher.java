package com.planetrush.chat.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisPublisher {

	private final RedisTemplate<String, Object> redisTemplate;
	private final ObjectMapper objectMapper;

	/**
	 * topic에 json메시지를 발행합니다.
	 * @param topic 메시지를 발행할 토픽
	 * @param message 발행할 메시지 내용
	 */
	public void publish(ChannelTopic topic, Object message) {
		try {
			String jsonMessage = objectMapper.writeValueAsString(message);
			log.info("jsonMessage: {}", jsonMessage);
			redisTemplate.convertAndSend(topic.getTopic(), jsonMessage);
		} catch (JsonProcessingException e) {
			// 예외 처리 로깅
			log.error("Error serializing message: {}", e.getMessage());
		}
	}
}

