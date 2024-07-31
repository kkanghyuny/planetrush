package com.planetrush.planetrush.planet.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.planetrush.core.aop.annotation.RequireJwtToken;
import com.planetrush.planetrush.core.aop.member.MemberContext;
import com.planetrush.planetrush.core.jwt.JwtTokenProvider;
import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.infra.s3.S3ImageService;
import com.planetrush.planetrush.planet.controller.response.SearchPlanetRes;
import com.planetrush.planetrush.planet.service.GetPlanetService;
import com.planetrush.planetrush.planet.service.dto.GetMainPlanetListDto;
import com.planetrush.planetrush.planet.service.dto.GetMyPlanetListDto;
import com.planetrush.planetrush.planet.service.dto.OngoingPlanetDto;
import com.planetrush.planetrush.planet.service.dto.PlanetDetailDto;
import com.planetrush.planetrush.planet.service.dto.SearchCond;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
public class GetPlanetController extends PlanetController {

	private final JwtTokenProvider jwtTokenProvider;
	private final S3ImageService s3ImageService;
	private final GetPlanetService getPlanetService;

	/**
	 * 행성을 검색합니다.
	 * @param category 카테고리
	 * @param keyword 키워드
	 * @param lastPlanetId 마지막 행성의 id
	 * @param size 크기
	 * @return 검색 결과를 담은 ResponseEntity
	 */
	@RequireJwtToken
	@GetMapping
	public ResponseEntity<BaseResponse<SearchPlanetRes>> searchPlanet(
		@RequestParam(value = "category", required = false) String category,
		@RequestParam(value = "keyword", required = false) String keyword,
		@RequestParam(value = "lp-id", required = false) Long lastPlanetId,
		@RequestParam("size") int size) {
		List<PlanetDetailDto> planets = getPlanetService.searchPlanet(SearchCond.builder()
			.category(category)
			.keyword(keyword)
			.size(size)
			.lastPlanetId(lastPlanetId)
			.build());
		return ResponseEntity.ok(
			BaseResponse.ofSuccess(
				SearchPlanetRes.builder()
					.planets(planets)
					.hasNext(isNotLastPage(size, planets))
					.build()));
	}

	/**
	 * 무한 스크롤을 위해 마지막 페이지인지 확인합니다.
	 * @param size 크기
	 * @param planets 행성 목록
	 * @return 마지막 페이지인지 여부
	 */
	private boolean isNotLastPage(int size, List<PlanetDetailDto> planets) {
		return planets.size() == size;
	}

	@RequireJwtToken
	@GetMapping("/detail")
	public ResponseEntity<BaseResponse<PlanetDetailDto>> getPlanetDetail(@RequestParam("planet-id") Long planetId) {
		Long memberId = MemberContext.getMemberId();
		return ResponseEntity.ok(BaseResponse.ofSuccess(getPlanetService.getPlanetDetail(memberId, planetId)));
	}

	/**
	 * 현재 진행 중인 행성을 상세 조회합니다.
	 * @param planetId 상세 조회할 행성의 고유 id
	 * @return 행성의 정보를 담은 ResponseEntity
	 */
	@RequireJwtToken
	@GetMapping("/ongoing")
	public ResponseEntity<BaseResponse<OngoingPlanetDto>> getOngoingPlanetDto(
		@RequestParam("planet-id") Long planetId) {
		Long memberId = MemberContext.getMemberId();
		OngoingPlanetDto res = getPlanetService.getOngoingPlanet(memberId, planetId);
		return ResponseEntity.ok(BaseResponse.ofSuccess(res));
	}

	/**
	 * 현재 사용자의 마이페이지를 위한 참여 중이면서 종료되지 않은 행성 목록을 가져옵니다.
	 * @return 현재 사용자의 행성 목록을 포함한 ResponseEntity 객체
	 */
	@RequireJwtToken
	@GetMapping("/me/list")
	public ResponseEntity<BaseResponse<List<GetMyPlanetListDto>>> getMyPlanetList() {
		Long memberId = MemberContext.getMemberId();
		return ResponseEntity.ok(BaseResponse.ofSuccess(getPlanetService.getMyPlanetList(memberId)));
	}

	/**
	 * 현재 사용자의 메인페이지를 위한 참여 중이면서 종료되지 않은 행성 목록을 가져옵니다.
	 * @return 현재 사용자의 행성 목록을 포함한 ResponseEntity 객체
	 */
	@RequireJwtToken
	@GetMapping("/main/list")
	public ResponseEntity<BaseResponse<List<GetMainPlanetListDto>>> getMainPlanetList() {
		Long memberId = MemberContext.getMemberId();
		return ResponseEntity.ok(BaseResponse.ofSuccess(getPlanetService.getMainPlanetList(memberId)));
	}
}
