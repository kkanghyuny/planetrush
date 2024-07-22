package com.planetrush.planetrush.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.planetrush.core.jwt.JwtTokenProvider;
import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.member.controller.request.KakaoLoginReq;
import com.planetrush.planetrush.member.controller.request.KakaoLogoutReq;
import com.planetrush.planetrush.member.service.AuthService;
import com.planetrush.planetrush.member.service.dto.LoginDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class AuthController extends MemberController {

	private final JwtTokenProvider jwtTokenProvider;
	private final AuthService authService;

	@PostMapping("/auth/login/kakao")
	public ResponseEntity<BaseResponse<LoginDto>> kakaoLogin(@RequestBody KakaoLoginReq req) {
		LoginDto res = authService.kakaoLogin(req.getAccessToken());
		return ResponseEntity.ok(BaseResponse.ofSuccess(res));
	}

	@PostMapping("/auth/logout/kakao")
	public ResponseEntity<BaseResponse<?>> kakaoLogout(@RequestBody KakaoLogoutReq req) {
		authService.kakaoLogout(req.getAccessToken());
		return ResponseEntity.ok(BaseResponse.ofSuccess());
	}

	@PatchMapping("/auth/exit")
	public ResponseEntity<BaseResponse<?>> withdrawnMember(
		@RequestHeader("Authorization") String accessToken
	) {
		Long memberId = jwtTokenProvider.getMemberId(accessToken);
		authService.withdrawnMember(memberId);
		return ResponseEntity.ok(BaseResponse.ofSuccess());
	}
}
