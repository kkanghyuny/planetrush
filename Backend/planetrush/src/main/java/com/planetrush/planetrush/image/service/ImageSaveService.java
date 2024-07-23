package com.planetrush.planetrush.image.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageSaveService {

	long saveImage(MultipartFile file, long memberId);
}
