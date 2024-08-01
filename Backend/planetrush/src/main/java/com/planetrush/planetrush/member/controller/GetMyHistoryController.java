package com.planetrush.planetrush.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.planetrush.core.aop.annotation.RequireJwtToken;
import com.planetrush.planetrush.core.aop.member.MemberContext;
import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.member.service.GetMyHistoryService;
import com.planetrush.planetrush.member.service.dto.GetMyHistoryDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class GetMyHistoryController extends MemberController {

	private final GetMyHistoryService getMyHistoryService;

	/**
	 * 마이페이지를 위한 사용자들의 통계 정보를 가져옵니다.
	 * @return ResponseEntity
	 */
	@RequireJwtToken
	@GetMapping("/mypage")
	public ResponseEntity<BaseResponse<GetMyHistoryDto>> getMyHistory() {
		Long memberId = MemberContext.getMemberId();
		GetMyHistoryDto getMyHistoryDto = getMyHistoryService.getMyHistory(memberId);
		return ResponseEntity.ok(BaseResponse.ofSuccess(getMyHistoryDto));
	}

}
