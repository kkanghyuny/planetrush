package com.planetrush.planetrush.infra.flask.util;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.planetrush.planetrush.verification.service.dto.FlaskResponseDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class FlaskUtil {

	@Value("${flask.verifyurl}")
	private String verifyUrl;
	private final RestTemplate restTemplate;

	public FlaskResponseDto verifyChallengeImg(String standardImgUrl, String targetImgUrl) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

		Map<String, String> body = new HashMap<>();
		body.put("standardImgUrl", standardImgUrl);
		body.put("targetImgUrl", targetImgUrl);
		HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(body, headers);

		return restTemplate.exchange(
			verifyUrl,
			HttpMethod.POST,
			requestEntity,
			FlaskResponseDto.class
		).getBody();
	}
}
