package com.planetrush.planetrush.verification.facade;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.planetrush.planetrush.infra.s3.S3ImageService;
import com.planetrush.planetrush.infra.s3.dto.FileMetaInfo;
import com.planetrush.planetrush.verification.facade.dto.VerifyChallengeDto;
import com.planetrush.planetrush.verification.service.VerificationService;
import com.planetrush.planetrush.verification.service.dto.VerificationResultDto;

import lombok.RequiredArgsConstructor;

@Transactional
@RequiredArgsConstructor
@Component
public class VerificationFacade {

	private final S3ImageService s3ImageService;
	private final VerificationService verificationService;

	public VerifyChallengeDto saveImgAndVerifyChallenge(MultipartFile verificationImg, Long memberId, Long planetId) {
		FileMetaInfo fileMetaInfo = s3ImageService.uploadVerificationImg(verificationImg, memberId);
		/*
		 * TODO: 이미지 유사도 검사 요청 후 응답 반환
		 *
		 * */
		verificationService.saveVerificationResult(VerificationResultDto.builder()
			.verified(true)  // TODO: 응답 결과로 교체
			.similarityScore(0.0)  // TODO: 응답 결과로 교체
			.imgUrl(fileMetaInfo.getUrl())
			.memberId(memberId)
			.planetId(planetId)
			.build());
		return VerifyChallengeDto.builder()
			.verified(true)  // TODO: 응답 결과로 교체
			.similarityScore(0.0) // TODO: 응답 결과로 교체
			.build();
	}

}
