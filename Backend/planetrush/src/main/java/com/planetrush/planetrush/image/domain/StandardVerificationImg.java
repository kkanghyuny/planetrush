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

/**
 * 챌린지 인증을 위한 예시 엔티티 클래스입니다.
 * 고유 식별자, 파일명, 확장자, 크기, url, 업로드 일자 등을 포함합니다.
 */
@Getter
@Entity
@Table(name = "standard_verification_img")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StandardVerificationImg {

	/**
	 * 챌린지 인증 예시 이미지의 고유 식별자입니다.
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "standard_verification_img_id")
	private long id;

	/**
	 * 챌린지 인증 예시 이미지의 파일명입니다.
	 */
	@Column(name = "img_name", length = 100, nullable = false)
	private String imgName;

	/**
	 * 챌린지 인증 예시 이미지의 파일 확장자입니다.
	 */
	@Column(name = "img_format", length = 50, nullable = false)
	private String imgFormat;

	/**
	 * 챌린지 인증 예시 이미지의 파일 크기입니다.
	 */
	@Column(name = "img_size", length = 100, nullable = false)
	private String imgSize;

	/**
	 * 챌린지 인증 예시 이미지의 파일 url입니다.
	 */
	@Column(name = "img_url", length = 256, nullable = false)
	private String imgUrl;

	/**
	 * 챌린지 인증 예시 이미지의 파일 업로드 일자입니다.
	 * 자동으로 현재 타임스탬프로 설정됩니다.
	 */
	@CreationTimestamp
	@Column(name = "upload_date", length = 100, nullable = false)
	private LocalDateTime uploadDate;

	/**
	 * 주어진 속성들로 새로운 표준 검증 이미지 객체를 생성합니다.
	 *
	 * @param imgName 이미지의 이름
	 * @param imgFormat 이미지의 포맷 (예: JPG, PNG)
	 * @param imgSize 이미지의 크기 (예: "500KB")
	 * @param imgUrl 이미지의 URL
	 * @param uploadDate 이미지의 업로드 날짜 및 시간
	 */
	@Builder
	public StandardVerificationImg(String imgName, String imgFormat, String imgSize, String imgUrl,
		LocalDateTime uploadDate) {
		this.imgName = imgName;
		this.imgFormat = imgFormat;
		this.imgSize = imgSize;
		this.imgUrl = imgUrl;
		this.uploadDate = uploadDate;
	}
}
