package com.planetrush.planetrush.infra.oauth.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.planetrush.planetrush.infra.oauth.dto.KakaoUserInfo;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class KakaoUtil {

	@Value("${kakao.loginurl}")
	private String loginUrl;

	@Value("${kakao.secret.key}")
	private String SERVICE_APP_ADMIN_KEY;

	@Value("${kakao.logouturl}")
	private String logoutUrl;

	public KakaoUserInfo getUserInfo(String accessToken) {

		KakaoUserInfo userInfo = new KakaoUserInfo();

		WebClient webClient = WebClient.builder().build();

		String response = webClient.get()
			.uri(loginUrl)
			.header("Authorization", ("Bearer " + accessToken))
			.header("Content-type", "application/x-www-form-urlencoded;charset=utf-8")
			.retrieve()
			.bodyToMono(String.class)
			.block();
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			userInfo = objectMapper.readValue(response, new TypeReference<KakaoUserInfo>() {
			});
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		return userInfo;
	}

	public void kakaoLogout(String id) {

		WebClient webClient = WebClient.builder()
			.defaultHeader("Content-Type", "application/x-www-form-urlencoded")
			.build();

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("target_id_type", "user_id");
		params.add("target_id", id);
		String response = webClient.post()
			.uri(logoutUrl)
			.header("Authorization", ("KakaoAK " + SERVICE_APP_ADMIN_KEY))
			.body(BodyInserters.fromFormData(params))
			.retrieve()
			.bodyToMono(String.class)
			.block();
	}

	public void unlinkWithKakao(String id) {
		String requestUrl = "https://kapi.kakao.com/v1/user/unlink";

		WebClient webClient = WebClient.builder().build();

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("target_id_type", "user_id");
		params.add("target_id", id);

		String response = webClient.post()
			.uri(requestUrl)
			.header("Authorization", ("KakaoAK " + SERVICE_APP_ADMIN_KEY))
			.body(BodyInserters.fromFormData(params))
			.retrieve()
			.bodyToMono(String.class)
			.block();
	}
}