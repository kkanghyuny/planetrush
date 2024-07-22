package com.planetrush.planetrush.core.jwt;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.planetrush.planetrush.core.exception.ExpiredJwtException;
import com.planetrush.planetrush.core.exception.UnAuthorizedException;
import com.planetrush.planetrush.core.jwt.dto.JwtToken;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtTokenProvider {

	@Value("${jwt.secret.key}")
	private String SECRET_KEY;

	@Value("${jwt.access-token.expiretime}")
	private int ACCESS_TOKEN_EXPRIATION_TIME;

	public JwtToken createToken(Long memberId) {
		String accessToken = createAccessToken(memberId);
		String refreshToken = createRefreshToken();
		return JwtToken.builder().accessToken(accessToken).refreshToken(refreshToken).build();
	}

	private String createAccessToken(Long memberId) {
		log.info("secret key: {}", SECRET_KEY);
		StringBuilder sb = new StringBuilder();
		sb.append("Bearer ");
		sb.append(
			Jwts.builder()
				.setSubject(memberId.toString())
				.claim("memberId", memberId)
				.claim("authorities", "MEMBER")
				.setExpiration(
					new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPRIATION_TIME))
				.signWith(
					Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256)
				.compact());
		return sb.toString();
	}

	private String createRefreshToken() {
		return UUID.randomUUID().toString();
	}

	public boolean validateToken(String accessToken) {
		log.info("secret key: {}", SECRET_KEY);
		if (!accessToken.startsWith("Bearer ")) {
			return false;
		}
		try {
			return parseClaims(accessToken).getExpiration().after(new Date());
		} catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
			log.error("잘못된 JWT 서명입니다.", e);
		} catch (UnsupportedJwtException e) {
			log.error("지원하지 않는 JWT 토큰입니다.", e);
		} catch (IllegalArgumentException e) {
			log.error("JWT 토큰이 없거나 잘못되었습니다.", e);
		} catch (ExpiredJwtException e) {
			log.error("만료된 JWT 토큰입니다.");
			throw new ExpiredJwtException();
		}
		return false;
	}

	public Long getMemberId(String accessToken) {
		Claims claims = null;
		try {
			claims = parseClaims(accessToken);
		} catch (Exception e) {
			log.error(e.getMessage());
			throw new UnAuthorizedException();
		}
		return claims.get("memberId", Long.class);
	}

	private Claims parseClaims(String accessToken) {
		return Jwts.parserBuilder()
			.setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
			.build()
			.parseClaimsJws(accessToken.replace("Bearer ", ""))
			.getBody();
	}
}