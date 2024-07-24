package com.planetrush.planetrush.member.service;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.planetrush.planetrush.core.jwt.JwtTokenProvider;
import com.planetrush.planetrush.core.jwt.dto.JwtToken;
import com.planetrush.planetrush.member.service.dto.ReissueDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReissueTokenServiceImpl implements ReissueTokenService {

	private final JwtTokenProvider jwtTokenProvider;
	private final RedisTemplate<String, String> redisTemplate;

	@Value("${jwt.refresh-token.expiretime}")
	private int REFRESH_TOKEN_EXPIRATION_TIME;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public ReissueDto reissueToken(String refreshToken) {
		Long memberId = jwtTokenProvider.getMemberIdFromRefreshToken(refreshToken);
		redisTemplate.delete(refreshToken);

		JwtToken newToken = jwtTokenProvider.createToken(memberId);

		redisTemplate.opsForValue().set(
			newToken.getRefreshToken(),
			memberId.toString(),
			REFRESH_TOKEN_EXPIRATION_TIME,
			TimeUnit.MILLISECONDS
		);

		return ReissueDto.builder()
			.accessToken(newToken.getAccessToken())
			.refreshToken(newToken.getRefreshToken())
			.build();
	}
}
