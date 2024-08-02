package com.planetrush.chat.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import com.planetrush.chat.service.dto.MessageDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RedisPublisher {

	private final RedisTemplate<String, Object> template;

	public void publish(ChannelTopic topic, MessageDto dto) {
		template.convertAndSend(topic.getTopic(), dto);
	}

	public void publish(ChannelTopic topic, String message) {
		template.convertAndSend(topic.getTopic(), message);
	}
}
