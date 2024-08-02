package com.planetrush.chat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.chat.domain.ChattingMessage;
import com.planetrush.chat.service.GetChatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
public class GetChatController extends ChatController {

	private final GetChatService getChatService;

	/**
	 * 주어진 행성 ID에 해당하는 채팅 메시지 목록을 가져옵니다.
	 *
	 * <p>이 메서드는 요청 파라미터로 전달된 행성 ID에 기반하여, 해당 행성과 관련된 모든 채팅 메시지를 조회하여 반환합니다.</p>
	 *
	 * @param planetId 채팅 메시지를 조회할 대상 행성의 ID
	 * @return 요청에 대한 응답으로, 해당 행성과 관련된 채팅 메시지 목록을 포함한 {@link ResponseEntity} 객체
	 */
	@GetMapping
	public ResponseEntity<List<ChattingMessage>> getChattingMessages(@RequestParam(value = "planet-id") Long planetId) {
		List<ChattingMessage> res = getChatService.getChattingMessageByPlanetId(planetId);
		return ResponseEntity.ok(res);
	}
}
