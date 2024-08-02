package com.planetrush.chat.service;

import java.util.List;

import com.planetrush.chat.domain.ChattingMessage;

public interface GetChatService {

	/**
	 * 주어진 행성 ID에 해당하는 채팅 메시지 목록을 조회합니다.
	 *
	 * @param planetId 채팅 메시지를 조회할 대상 행성의 ID
	 * @return 주어진 행성 ID에 해당하는 채팅 메시지 목록
	 */
	List<ChattingMessage> getChattingMessageByPlanetId(Long planetId);

}
