package com.planetrush.chat.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.chat.service.dto.MessageDto;
import com.planetrush.chat.service.RedisPubService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v2/chat/test")
public class RedisPubSubController {

	private final RedisPubService redisSubscribeService;

	@GetMapping
	public String test() {
		return "test";
	}

	@PostMapping("/send")
	public void sendMessage(@RequestParam(required = true) String channel, @RequestBody MessageDto message) {
		log.info("Redis Pub MSG Channel = {}", channel);
		redisSubscribeService.pubMsgChannel(channel, message);
	}

	@PostMapping("/cancle")
	public void cancelSubChannel(@RequestParam String channel) {
		redisSubscribeService.cancelSubChannel(channel);
	}
}
