package com.planetrush.chat.service;

import com.planetrush.chat.service.dto.SaveChatDto;

public interface SaveChatService {

	/**
	 * 채팅 메시지를 저장합니다.
	 *
	 * @param saveChatDto 저장할 채팅 메시지의 정보를 담고 있는 {@link SaveChatDto} 객체
	 */
	void saveChat(SaveChatDto saveChatDto);
}
