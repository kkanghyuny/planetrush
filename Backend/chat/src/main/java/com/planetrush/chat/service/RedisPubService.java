package com.planetrush.chat.service;

import com.planetrush.chat.service.dto.SendChatDto;

/**
 * 채팅 메시지를 발행(publish)하는 기능 인터페이스 입니다.
 */
public interface RedisPubService {

	/**
	 * 채팅 메시지를 발행합니다.
	 * @param dto 발행할 채팅 메시지의 정보객체
	 */
	void pubMsgChannel(SendChatDto dto);
}
