package com.planetrush.planetrush.core.jwt.util;

import java.io.UnsupportedEncodingException;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtil {

	// private String accessKey = "ssafy_11_planetrush_access_key";
	// private SecretKey accessSecretKey = Keys.hmacShaKeyFor(accessKey.getBytes(StandardCharsets.UTF_8));

	private final String BEARER = "Bearer ";
	private final String ACCESS_TOKEN = "access-token";
	private final String MEMBER_ID = "member-id";
	private final String NICKNAME = "nickname";

	@Value("${jwt.issuer}")
	private String issuer;

	@Value("${jwt.salt}")
	private String salt;

	@Value("${jwt.access-token.expiretime}")
	private long accessTokenExpireTime;

	public String createAccessToken(String memberId, String nickname) {
		return create(memberId, nickname, ACCESS_TOKEN, accessTokenExpireTime);
	}

	private String create(String memberId, String nickname, String subject, long expireTime) {
		return BEARER + Jwts.builder()
			.setSubject(subject)
			.setIssuer(issuer)
			.claim(MEMBER_ID, memberId)
			.claim(NICKNAME, nickname)
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + expireTime))
			.signWith(Keys.hmacShaKeyFor(generateKey()), SignatureAlgorithm.HS256)
			.compact();
	}

	public boolean checkToken(String token) {
		Jws<Claims> claims = getClaims(token);
		if (isExpired(claims)) {
			// throw new ExpiredJwtException();
		}
		if (isDiffIssuer(claims)) {
			// throw new UnsupportedJwtException();
		}
		return true;
	}

	public String getMemberId(String token) {
		Jws<Claims> claims = null;
		try {
			claims = getClaims(token);
		} catch (Exception e) {
			log.error(e.getMessage());
			// throw new UnAuthorizedException();
		}
		return claims.getBody().get(MEMBER_ID, String.class);
	}

	private boolean isDiffIssuer(Jws<Claims> claims) {
		return !claims.getBody().getIssuer().equals(issuer);
	}

	private static boolean isExpired(Jws<Claims> claims) {
		return claims.getBody().getExpiration().before(new Date());
	}

	private byte[] generateKey() {
		byte[] key = null;
		try {
			key = salt.getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			if (log.isInfoEnabled()) {
				e.printStackTrace();
			} else {
				log.error("Making JWT Key Error {}", e.getMessage());
			}
		}
		return key;
	}

	public Jws<Claims> getClaims(String token) {
		return Jwts.parserBuilder()
			.setSigningKey(Keys.hmacShaKeyFor(generateKey()))
			.build()
			.parseClaimsJws(token.replace(BEARER, ""));
	}
}
