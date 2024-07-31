package com.planetrush.planetrush.planet.facade;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.planetrush.planetrush.infra.s3.S3ImageService;
import com.planetrush.planetrush.infra.s3.dto.FileMetaInfo;
import com.planetrush.planetrush.planet.facade.dto.RegisterPlanetFacadeDto;
import com.planetrush.planetrush.planet.service.RegisterPlanetService;
import com.planetrush.planetrush.planet.service.dto.RegisterPlanetDto;

import lombok.RequiredArgsConstructor;

@Transactional
@RequiredArgsConstructor
@Component
public class RegisterPlanetFacade {

	private final S3ImageService s3ImageService;
	private final RegisterPlanetService registerPlanetService;

	public void registerPlanet(RegisterPlanetFacadeDto dto, MultipartFile customPlanetImg,
		MultipartFile stdVerificationImg) {
		String planetImgUrl = customPlanetImg == null ? dto.getPlanetImgUrl() :
			uploadCustomPlanetImg(customPlanetImg, dto.getMemberId());
		String stdVerificationImgUrl = uploadStdVerificationImg(stdVerificationImg, dto.getMemberId());
		registerPlanetService.registerPlanet(RegisterPlanetDto.builder()
			.name(dto.getName())
			.memberId(dto.getMemberId())
			.startDate(dto.getStartDate())
			.endDate(dto.getEndDate())
			.content(dto.getContent())
			.maxParticipants(dto.getMaxParticipants())
			.category(dto.getCategory())
			.authCond(dto.getAuthCond())
			.planetImgUrl(planetImgUrl)
			.standardVerificationImgUrl(stdVerificationImgUrl)
			.build());
	}

	private String uploadCustomPlanetImg(MultipartFile customPlanetImg, Long memberId) {
		FileMetaInfo fileMetaInfo = s3ImageService.uploadPlanetImg(customPlanetImg, memberId);
		return fileMetaInfo.getUrl();
	}

	private String uploadStdVerificationImg(MultipartFile stdVerificationImg, Long memberId) {
		FileMetaInfo fileMetaInfo = s3ImageService.uploadStandardVerificationImg(stdVerificationImg, memberId);
		return fileMetaInfo.getUrl();
	}

}
