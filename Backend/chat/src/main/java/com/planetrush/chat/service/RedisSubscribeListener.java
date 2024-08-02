package com.planetrush.chat.service;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.planetrush.chat.service.dto.MessageDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisSubscribeListener implements MessageListener {

	private final RedisTemplate<String, Object> template;
	private final ObjectMapper objectMapper;

	@Override
	public void onMessage(Message message, byte[] pattern) {
		try {
			String publishMessage = template
				.getStringSerializer().deserialize(message.getBody());
			MessageDto messageDto = objectMapper.readValue(publishMessage, MessageDto.class);
			log.info("Redis Subscribe Channel : " + messageDto.getPlanetId());
			log.info("Redis SUB Message : {}", publishMessage);
		} catch (JsonProcessingException e) {
			log.error(e.getMessage());
		}
	}
}
