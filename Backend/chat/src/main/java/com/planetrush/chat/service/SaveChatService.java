package com.planetrush.chat.service;

import com.planetrush.chat.service.dto.SendChatDto;

public interface SaveChatService {

	/**
	 * 채팅 메시지를 저장합니다.
	 *
	 * @param sendChatDto 저장할 채팅 메시지의 정보를 담고 있는 {@link SendChatDto} 객체
	 */
	void saveChat(SendChatDto sendChatDto);
}
