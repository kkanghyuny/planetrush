package com.planetrush.planetrush.image.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.planetrush.planetrush.image.repository.CustomPlanetImgRepository;
import com.planetrush.planetrush.planet.domain.image.CustomPlanetImg;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CustomImageSaveServiceImpl implements ImageSaveService {

	private final S3ImageService s3ImageService;
	private final CustomPlanetImgRepository customPlanetImgRepository;

	@Override
	public long saveImage(MultipartFile file, long memberId) {
		String uploadedUrl = s3ImageService.uploadPlanetImg(file, memberId);
		String fileName = file.getOriginalFilename();
		String fileFormat = getFileExtension(fileName);
		String fileSize = String.valueOf(file.getSize());

		CustomPlanetImg customPlanetImg = CustomPlanetImg.builder()
			.imgName(fileName)
			.imgFormat(fileFormat)
			.imgSize(fileSize)
			.imgUrl(uploadedUrl)
			.build();

		return customPlanetImgRepository.save(customPlanetImg).getId();
	}

	/**
	 * 파일 확장자 추출
	 * @param fileName 파일명
	 * @return 추출된 확장자 반환
	 */
	private String getFileExtension(String fileName) {
		if (fileName == null || fileName.isEmpty() || !fileName.contains(".")) {
			return "";
		}
		return fileName.substring(fileName.lastIndexOf(".") + 1);
	}
}
