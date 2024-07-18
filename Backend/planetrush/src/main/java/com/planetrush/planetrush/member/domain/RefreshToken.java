package com.planetrush.planetrush.member.domain;

import org.springframework.data.annotation.Id;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
// import org.springframework.data.redis.core.RedisHash;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
// @RedisHash(value = "refresh-token", timeToLive = 7 * 24 * 60 * 60) // 7일
public class RefreshToken {

	@Id
	private Long memberId;

	private String token;

}