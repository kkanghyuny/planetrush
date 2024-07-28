package com.planetrush.planetrush.planet.service.image;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.planetrush.planetrush.planet.domain.image.CustomPlanetImg;
import com.planetrush.planetrush.planet.domain.image.StandardVerificationImg;
import com.planetrush.planetrush.planet.repository.CustomPlanetImgRepository;
import com.planetrush.planetrush.planet.repository.StandardVerificationImgRepository;
import com.planetrush.planetrush.planet.service.dto.FileMetaInfo;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class SaveImgServiceImpl implements SaveImgService {

	private final S3ImageService s3ImageService;
	private final CustomPlanetImgRepository customPlanetImgRepository;
	private final StandardVerificationImgRepository standardVerificationImgRepository;

	@Override
	public Long saveStandardVerificationImg(MultipartFile file, Long memberId) {
		FileMetaInfo fileMetaInfo = s3ImageService.uploadStandardVerificationImg(file, memberId);
		return standardVerificationImgRepository.save(StandardVerificationImg.builder()
			.imgUrl(fileMetaInfo.getUrl())
			.imgName(fileMetaInfo.getName())
			.imgFormat(fileMetaInfo.getFormat())
			.imgSize(fileMetaInfo.getSize())
			.build()).getId();
	}

	@Override
	public Long saveCustomPlanetImg(MultipartFile file, Long memberId) {
		FileMetaInfo fileMetaInfo = s3ImageService.uploadPlanetImg(file, memberId);
		return customPlanetImgRepository.save(CustomPlanetImg.builder()
			.imgUrl(fileMetaInfo.getUrl())
			.imgName(fileMetaInfo.getName())
			.imgFormat(fileMetaInfo.getFormat())
			.imgSize(fileMetaInfo.getSize())
			.build()).getId();
	}

}
