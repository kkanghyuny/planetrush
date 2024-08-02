package com.planetrush.chat.service;

import org.springframework.stereotype.Service;

import com.planetrush.chat.domain.ChattingMessage;
import com.planetrush.chat.repository.ChatRepository;
import com.planetrush.chat.service.dto.SaveChatDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class SaveChatServiceImpl implements SaveChatService {

	private final ChatRepository chatRepository;

	/**
	 * {@inheritDoc}
	 * <p>이 메서드는 {@link SaveChatDto} 객체를 기반으로 채팅 메시지를 생성하고, 이를 데이터베이스에 저장합니다.</p>
	 *
	 * @param saveChatDto 저장할 채팅 메시지의 정보를 담고 있는 {@link SaveChatDto} 객체
	 */
	@Override
	public void saveChat(SaveChatDto saveChatDto) {
		ChattingMessage chattingMessage = chatRepository.save(ChattingMessage.builder()
			.memberId(saveChatDto.getMemberId())
			.planetId(saveChatDto.getPlanetId())
			.nickname(saveChatDto.getNickname())
			.content(saveChatDto.getContent())
			.createdAt(saveChatDto.getCreatedAt())
			.build());
	}
}
