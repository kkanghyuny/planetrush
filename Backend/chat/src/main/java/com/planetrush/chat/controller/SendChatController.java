package com.planetrush.chat.controller;

import java.time.LocalDateTime;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.planetrush.chat.controller.request.SendChatReq;
import com.planetrush.chat.service.RedisPubService;
import com.planetrush.chat.service.SaveChatService;
import com.planetrush.chat.service.dto.SendChatDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Controller
public class SendChatController extends ChatController {

	private final RedisPubService redisPubService;
	private final SaveChatService saveChatService;
	private final SimpMessagingTemplate messagingTemplate;
	private final JdbcTemplate jdbcTemplate;

	/**
	 * 채팅 메시지를 저장하고, Redis Pub/Sub을 통해 해당 메시지를 전파합니다.
	 *
	 * <p>이 메서드는 클라이언트로부터 전달된 채팅 메시지 정보를 받아서, 다음 작업을 수행합니다:</p>
	 * <ol>
	 *   <li>채팅 메시지를 데이터베이스에 저장합니다.</li>
	 *   <li>Redis의 Pub/Sub 기능을 이용하여 저장된 채팅 메시지를 구독자들에게 전파합니다.</li>
	 * </ol>
	 *
	 * @param req 저장할 채팅 메시지의 정보가 포함된 {@link SendChatReq} 객체
	 *
	 * @see SendChatReq
	 * @see SaveChatService
	 */
	@MessageMapping("/send")
	public void saveChat(SendChatReq req) {
		String sql = "SELECT nickname FROM member WHERE member_id = ?";
		SendChatDto dto = SendChatDto.builder()
			.memberId(req.getMemberId())
			.planetId(req.getPlanetId())
			.content(req.getContent())
			.nickname(jdbcTemplate.queryForObject(sql, new Object[] {req.getMemberId()}, String.class))
			.createdAt(LocalDateTime.now())
			.build();
		saveChatService.saveChat(dto);
		redisPubService.pubMsgChannel(dto);
		String destination = "/sub/planet" + req.getPlanetId();
		messagingTemplate.convertAndSend(destination, dto);
	}
}
