package com.planetrush.planetrush.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.planetrush.core.jwt.JwtTokenProvider;
import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.member.service.UpdateMemberService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class UpdateMemberController extends MemberController {

	private final JwtTokenProvider jwtTokenProvider;
	private final UpdateMemberService updateMemberService;

	@PatchMapping("/profile")
	public ResponseEntity<BaseResponse<?>> updateMemberNickname(
		@RequestHeader("Authorization") String accessToken,
		@RequestParam("nickname") String nickname
	) {
		Long memberId = jwtTokenProvider.getMemberId(accessToken);
		updateMemberService.updateMemberNickname(memberId, nickname);
		return ResponseEntity.ok(BaseResponse.ofSuccess());
	}

}
