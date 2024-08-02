package com.planetrush.chat.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {

	private static final long serialVersionUID = 1L;

	private String message;
	private String sender;
	private String planetId;
}
