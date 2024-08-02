package com.planetrush.chat.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.chat.controller.request.SaveChatReq;
import com.planetrush.chat.service.SaveChatService;
import com.planetrush.chat.service.dto.SaveChatDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
public class SaveChatController extends ChatController{

	private final SaveChatService saveChatService;

	/**
	 * 채팅 메시지를 저장하고, Redis Pub/Sub을 통해 해당 메시지를 전파합니다.
	 *
	 * <p>이 메서드는 클라이언트로부터 전달된 채팅 메시지 정보를 받아서, 다음 작업을 수행합니다:</p>
	 * <ol>
	 *   <li>채팅 메시지를 데이터베이스에 저장합니다.</li>
	 *   <li>Redis의 Pub/Sub 기능을 이용하여 저장된 채팅 메시지를 구독자들에게 전파합니다.</li>
	 * </ol>
	 *
	 * @param req 저장할 채팅 메시지의 정보가 포함된 {@link SaveChatReq} 객체
	 *
	 * @see SaveChatReq
	 * @see SaveChatService
	 */
	@MessageMapping("/save")
	public void saveChat(@Payload SaveChatReq req) {
		saveChatService.saveChat(SaveChatDto.builder()
			.memberId(req.getMemberId())
			.planetId(req.getPlanetId())
			.nickname(req.getNickname())
			.content(req.getContent())
			.createdAt(req.getCreatedAt())
			.build());
	}
}
