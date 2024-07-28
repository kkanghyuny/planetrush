package com.planetrush.planetrush.planet.service.image;

import org.springframework.web.multipart.MultipartFile;

public interface SaveImgService {

	Long saveStandardVerificationImg(MultipartFile file, Long memberId);

	Long saveCustomPlanetImg(MultipartFile file, Long memberId);

}
