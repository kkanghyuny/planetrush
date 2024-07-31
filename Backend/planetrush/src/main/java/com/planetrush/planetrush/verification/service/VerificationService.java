package com.planetrush.planetrush.verification.service;

import com.planetrush.planetrush.verification.service.dto.VerificationResultDto;

public interface VerificationService {

	/**
	 * 사진 url과 유사도, 인증 여부를 저장합니다.
	 * @param dto 사진 url과 유사도, 인증 여부, 사용자 고유 id, 행성의 고유 id
	 */
	void saveVerificationResult(VerificationResultDto dto);

}
