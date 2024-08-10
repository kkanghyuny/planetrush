package com.planetrush.planetrush.verification.facade;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.planetrush.planetrush.infra.s3.S3ImageService;
import com.planetrush.planetrush.infra.s3.dto.FileMetaInfo;
import com.planetrush.planetrush.verification.facade.dto.VerifyChallengeDto;
import com.planetrush.planetrush.verification.service.VerificationService;
import com.planetrush.planetrush.verification.service.dto.FlaskResponseDto;
import com.planetrush.planetrush.verification.service.dto.VerificationResultDto;

import lombok.RequiredArgsConstructor;

@Transactional
@RequiredArgsConstructor
@Component
public class VerificationFacade {

	@Value("${flask.verifyurl}")
	private String verifyUrl;

	private final RestTemplate restTemplate;
	private final S3ImageService s3ImageService;
	private final VerificationService verificationService;

	/**
	 * 사진을 저장하고 유사도를 검사해 결과를 보여줍니다.
	 * @param verificationImg 인증 사진
	 * @param memberId 유저의 고유 id
	 * @param planetId 행성의 고유 id
	 * @return 인증 여부, 유사도
	 */
	public VerifyChallengeDto saveImgAndVerifyChallenge(MultipartFile verificationImg, Long memberId, Long planetId) {
		FileMetaInfo fileMetaInfo = s3ImageService.uploadVerificationImg(verificationImg, memberId);
		String standardImgUrl = verificationService.getStandardImgUrlByPlanetId(planetId);
		String targetImgUrl = fileMetaInfo.getUrl();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

		Map<String, String> body = new HashMap<>();
		body.put("standardImgUrl", standardImgUrl);
		body.put("targetImgUrl", targetImgUrl);

		HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(body, headers);

		ResponseEntity<FlaskResponseDto> response = restTemplate.exchange(
			verifyUrl,
			HttpMethod.POST,
			requestEntity,
			FlaskResponseDto.class
		);

		FlaskResponseDto responseDto = response.getBody();

		verificationService.saveVerificationResult(VerificationResultDto.builder()
			.verified(responseDto.isVerified())
			.similarityScore(responseDto.getSimilarityScore())
			.imgUrl(fileMetaInfo.getUrl())
			.memberId(memberId)
			.planetId(planetId)
			.build());
		return VerifyChallengeDto.builder()
			.verified(responseDto.isVerified())
			.similarityScore(responseDto.getSimilarityScore())
			.build();
	}

}
