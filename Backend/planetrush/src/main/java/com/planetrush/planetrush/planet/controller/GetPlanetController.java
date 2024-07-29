package com.planetrush.planetrush.planet.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.planetrush.planetrush.core.aop.annotation.RequireJwtToken;
import com.planetrush.planetrush.core.aop.member.MemberContext;
import com.planetrush.planetrush.core.jwt.JwtTokenProvider;
import com.planetrush.planetrush.core.template.response.BaseResponse;
import com.planetrush.planetrush.planet.controller.response.SearchPlanetRes;
import com.planetrush.planetrush.planet.service.GetPlanetService;
import com.planetrush.planetrush.planet.service.dto.OngoingPlanetDto;
import com.planetrush.planetrush.planet.service.dto.PlanetDetailDto;
import com.planetrush.planetrush.planet.service.dto.SearchCond;
import com.planetrush.planetrush.planet.service.image.S3ImageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
public class GetPlanetController extends PlanetController {

	private final JwtTokenProvider jwtTokenProvider;
	private final S3ImageService s3ImageService;
	private final GetPlanetService getPlanetService;

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

	private boolean isNotLastPage(int size, List<PlanetDetailDto> planets) {
		return planets.size() == size;
	}

	@GetMapping("/detail")
	public ResponseEntity<BaseResponse<PlanetDetailDto>> getPlanetDetail(
		@RequestHeader(value = "Authorization", required = false) String accessToken,
		@RequestParam("planet-id") Long planetId) {
		Long memberId = null;
		if (accessToken != null) {
			memberId = jwtTokenProvider.getMemberId(accessToken);
		}
		return ResponseEntity.ok(BaseResponse.ofSuccess(getPlanetService.getPlanetDetail(memberId, planetId)));
	}

	@RequireJwtToken
	@GetMapping("/me")
	public ResponseEntity<BaseResponse<OngoingPlanetDto>> getOngoingPlanetDto(
		@RequestParam("planet-id") Long planetId) {
		Long memberId = MemberContext.getMemberId();
		OngoingPlanetDto res = getPlanetService.getOngoingPlanet(memberId, planetId);
		return ResponseEntity.ok(BaseResponse.ofSuccess(res));
	}

}