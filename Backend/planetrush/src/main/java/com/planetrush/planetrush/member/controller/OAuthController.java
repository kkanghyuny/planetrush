package com.planetrush.planetrush.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.member.controller.request.KakaoLoginReq;
import com.planetrush.planetrush.member.service.OAuthService;
import com.planetrush.planetrush.member.service.dto.LoginDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
@RestController
public class OAuthController {

	private final OAuthService oAuthService;

	@PostMapping("/auth/login/kakao")
	public ResponseEntity<BaseResponse<LoginDto>> doKakaoLogin(@RequestBody KakaoLoginReq req) {
		LoginDto res = oAuthService.kakaoLogin(req.getAccessToken());
		return ResponseEntity.ok(BaseResponse.ofSuccess(res));
	}

}
