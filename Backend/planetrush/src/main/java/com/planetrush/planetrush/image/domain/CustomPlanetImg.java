package com.planetrush.planetrush.image.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "custom_planet_img")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CustomPlanetImg {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "custom_planet_img_id")
	private long id;

	@Column(name = "img_name", length = 100, nullable = false)
	private String imgName;

	@Column(name = "img_format", length = 50, nullable = false)
	private String imgFormat;

	@Column(name = "img_size", length = 100, nullable = false)
	private String imgSize;

	@Column(name = "img_url", length = 256, nullable = false)
	private String imgUrl;

	@CreationTimestamp
	@Column(name = "upload_date", length = 100, nullable = false)
	private LocalDateTime uploadDate;

	@Builder
	public CustomPlanetImg(String imgName, String imgFormat, String imgSize, String imgUrl,
		LocalDateTime uploadDate) {
		this.imgName = imgName;
		this.imgFormat = imgFormat;
		this.imgSize = imgSize;
		this.imgUrl = imgUrl;
		this.uploadDate = uploadDate;
	}
}
