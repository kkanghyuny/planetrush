package com.planetrush.chat.controller.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SendChatReq {

	private Long memberId;
	private Long planetId;
	private String content;
	
}
