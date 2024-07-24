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
import com.planetrush.planetrush.member.service.AuthService;
import com.planetrush.planetrush.member.service.dto.LoginDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class AuthController extends MemberController {

	private final JwtTokenProvider jwtTokenProvider;
	private final AuthService authService;

	/**
	 * 카카오 로그인을 진행합니다.
	 * @param req 카카오에서 발급 받은 accessToken
	 * @return 새로 발급한 accessToken, refreshToken을 포함한 ResponseEntity
	 * @see LoginDto
	 */
	@PostMapping("/auth/login/kakao")
	public ResponseEntity<BaseResponse<LoginDto>> kakaoLogin(@RequestBody KakaoLoginReq req) {
		LoginDto res = authService.kakaoLogin(req.getAccessToken());
		return ResponseEntity.ok(BaseResponse.ofSuccess(res));
	}

	/**
	 * 카카오 로그아웃을 진행합니다.
	 * @param accessToken 발급해 준 accessToken
	 * @return ResponseEntity
	 */
	// TODO: refreshToken을 넘겨받아 삭제하기, accessToken 어노테이션으로 변경하기
	@PostMapping("/auth/logout/kakao")
	public ResponseEntity<BaseResponse<?>> kakaoLogout(@RequestHeader("Authorization") String accessToken) {
		Long memberId = jwtTokenProvider.getMemberId(accessToken);
		authService.kakaoLogout(memberId);
		return ResponseEntity.ok(BaseResponse.ofSuccess());
	}

	/**
	 * 회원을 탈퇴시킵니다.
	 * @param accessToken 발급해 준 accessToken
	 * @return ResponseEntity
	 */
	@PatchMapping("/auth/exit")
	public ResponseEntity<BaseResponse<?>> withdrawnMember(
		@RequestHeader("Authorization") String accessToken
	) {
		Long memberId = jwtTokenProvider.getMemberId(accessToken);
		authService.withdrawnMember(memberId);
		return ResponseEntity.ok(BaseResponse.ofSuccess());
	}
}
