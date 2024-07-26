package com.planetrush.planetrush.planet.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.planetrush.planetrush.member.domain.Member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "verification_record")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class VerificationRecord {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "verification_record_id")
	private Long id;

	/**
	 * 사용자의 정보를 나타냅니다.
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	/**
	 * planet의 정보를 나타냅니다.
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "planet_id")
	private Planet planet;

	/**
	 * 인증 여부를 나타냅니다.
	 */
	@Column(name = "verified")
	private boolean verified;

	/**
	 * 인증사진 유사도를 나타냅니다.
	 */
	@Column(name = "similarity_score")
	private double similarityScore;

	/**
	 * 챌린지 인증 이미지의 파일명입니다.
	 */
	@Column(name = "img_name", length = 100, nullable = false)
	private String imgName;

	/**
	 * 챌린지 인증 이미지의 파일 확장자입니다.
	 */
	@Column(name = "img_format", length = 50, nullable = false)
	private String imgFormat;

	/**
	 * 챌린지 인증 이미지의 파일 크기입니다.
	 */
	@Column(name = "img_size", length = 100, nullable = false)
	private String imgSize;

	/**
	 * 챌린지 인증 이미지의 파일 url입니다.
	 */
	@Column(name = "img_url", length = 256, nullable = false)
	private String imgUrl;

	/**
	 * 챌린지 인증 이미지의 파일 업로드 일자입니다.
	 * 자동으로 현재 타임스탬프로 설정됩니다.
	 */
	@CreationTimestamp
	@Column(name = "upload_date", length = 100, nullable = false)
	private LocalDateTime uploadDate;

	@Builder
	public VerificationRecord(Member member, Planet planet, boolean verified, double similarityScore, String imgName,
		String imgFormat, String imgSize, String imgUrl) {
		this.member = member;
		this.planet = planet;
		this.verified = verified;
		this.similarityScore = similarityScore;
		this.imgName = imgName;
		this.imgFormat = imgFormat;
		this.imgSize = imgSize;
		this.imgUrl = imgUrl;
	}

}
