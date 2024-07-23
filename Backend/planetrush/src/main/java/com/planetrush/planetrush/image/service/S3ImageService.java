package com.planetrush.planetrush.image.service;

import org.springframework.web.multipart.MultipartFile;

public interface S3ImageService {

	String uploadPlanetImg(MultipartFile file, long memberId);

	String uploadStandardVerificationImg(MultipartFile file, long memberId);

	String deleteImageFromS3(String imageUrl);

}
