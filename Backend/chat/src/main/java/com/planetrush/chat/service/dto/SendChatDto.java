package com.planetrush.chat.service.dto;

import java.io.Serializable;
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
public class SendChatDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long memberId;
	private Long planetId;
	private String content;
	private String nickname;
	private LocalDateTime createdAt;
}
