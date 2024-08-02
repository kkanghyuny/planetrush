package com.planetrush.chat.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Builder;
import lombok.Data;

@Document(collection = "chatting_message")
@Data
public class ChattingMessage {

	/**
	 * 채팅 메시지의 고유 ID.
	 * <p>이 필드는 메시지를 식별하는 데 사용됩니다.</p>
	 */
	@Id
	private String chattingMessageId;

	/**
	 * 메시지를 작성한 회원의 ID.
	 * <p>이 필드는 메시지를 작성한 사용자를 식별하는 데 사용됩니다.</p>
	 */
	private Long memberId;

	/**
	 * 메시지가 속한 행성의 ID.
	 * <p>이 필드는 메시지가 어느 행성에 관련되어 있는지를 나타냅니다.</p>
	 */
	private Long planetId;

	/**
	 * 메시지를 작성한 사용자의 닉네임.
	 * <p>이 필드는 메시지 작성자의 이름을 저장합니다.</p>
	 */
	private String nickname;

	/**
	 * 메시지의 내용.
	 * <p>이 필드는 실제 채팅 메시지의 텍스트를 저장합니다.</p>
	 */
	private String content;

	/**
	 * 메시지가 작성된 시간.
	 * <p>이 필드는 메시지의 작성 시점을 기록합니다.</p>
	 */
	private LocalDateTime createdAt;

	/**
	 * 채팅 메시지를 생성하는 빌더 생성자.
	 *
	 * @param memberId 메시지를 작성한 회원의 ID
	 * @param planetId 메시지가 속한 행성의 ID
	 * @param nickname 메시지를 작성한 사용자의 닉네임
	 * @param content 메시지의 내용
	 * @param createdAt 메시지가 작성된 시간
	 */
	@Builder
	public ChattingMessage(Long memberId, Long planetId, String nickname, String content, LocalDateTime createdAt) {
		this.memberId = memberId;
		this.planetId = planetId;
		this.nickname = nickname;
		this.content = content;
		this.createdAt = createdAt;
	}
}
