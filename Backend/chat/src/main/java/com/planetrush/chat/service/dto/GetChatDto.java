package com.planetrush.chat.service.dto;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GetChatDto {

	private Long memberId;
	private Long planetId;
	private String nickname;
	private String content;
	private LocalDateTime createdAt;

	public void setNicknameByMemberId(String nickname) {
		this.nickname = nickname;
	}

}
