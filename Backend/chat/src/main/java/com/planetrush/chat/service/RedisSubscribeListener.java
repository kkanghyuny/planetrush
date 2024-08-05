package com.planetrush.chat.service;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.planetrush.chat.service.dto.SendChatDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Redis 채널을 구독하여 메시지를 수신하는 서비스 입니다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RedisSubscribeListener implements MessageListener {

	private final RedisTemplate<String, Object> template;
	private final ObjectMapper objectMapper;

	/**
	 * Redis에서 메시지를 수신하여 처리합니다.
	 *
	 * @param message 수신한 메시지
	 * @param pattern 패턴
	 */
	@Override
	public void onMessage(Message message, byte[] pattern) {
		try {
			String publishMessage = (String)template.getValueSerializer().deserialize(message.getBody());

			SendChatDto messageDto = objectMapper.readValue(publishMessage, SendChatDto.class);

			log.info("Redis Subscribe Channel : " + messageDto.getPlanetId());
		} catch (JsonProcessingException e) {
			log.error("Error parsing JSON: {}", e.getMessage());
		} catch (ClassCastException e) {
			log.error("Error casting message body to String: {}", e.getMessage());
		}
	}
}