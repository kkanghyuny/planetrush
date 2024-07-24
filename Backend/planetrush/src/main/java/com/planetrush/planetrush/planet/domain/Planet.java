package com.planetrush.planetrush.planet.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.planetrush.planetrush.planet.domain.image.CustomPlanetImg;
import com.planetrush.planetrush.planet.domain.image.DefaultPlanetImg;
import com.planetrush.planetrush.planet.domain.image.StandardVerificationImg;
import com.planetrush.planetrush.planet.exception.NegativeParticipantCountException;
import com.planetrush.planetrush.planet.exception.ParticipantsOverflowException;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 행성 정보를 나타내는 엔티티 클래스입니다.
 * 고유 식별자, 행성명, 카테고리, 챌린지명, 시작일자, 종료일자, 최대 참여자, 현재 참여자, 참여 멤버,
 * 행성 상태, 생성 일자, 행성 이미지, 챌린지 인증 예시 이미지 등을 포함합니다.
 */
@Getter
@Entity
@Table(name = "planet")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Planet {

	/**
	 * 행성의 고유 식별자입니다.
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "planet_id")
	private Long id;

	/**
	 * 행성의 이름입니다.
	 */
	@Column(name = "name", length = 10, nullable = false)
	private String name;

	/**
	 * 행성의 카테고리입니다.
	 */
	@Enumerated(EnumType.STRING)
	@Column(name = "category", nullable = false)
	private Category category;

	/**
	 * 행성이 도전하는 챌린지의 내용입니다.
	 */
	@Column(name = "challenge_content", nullable = false)
	private String content;

	/**
	 * 챌린지가 시작되는 일자입니다.
	 */
	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	/**
	 * 챌린지가 종료되는 일자입니다.
	 */
	@Column(name = "end_date", nullable = false)
	private LocalDate endDate;

	/**
	 * 최대로 참여할 수 있는 인원입니다.
	 */
	@Column(name = "max_participants", nullable = false)
	private int maxParticipants;

	/**
	 * 현재 참여 중인 인원입니다.
	 */
	@Column(name = "current_participants", nullable = false)
	private int currentParticipants;

	/**
	 * 챌린지 인증을 위한 조건에 대한 설명입니다.
	 */
	@Column(name = "verification_cond", nullable = false)
	private String verificationCond;

	/**
	 * 행성에 참여 중인 member들입니다.
	 */
	@OneToMany(mappedBy = "planet")
	private final List<Resident> residents = new ArrayList<>();

	/**
	 * 행성의 상태 정보입니다.
	 */
	@Enumerated(EnumType.STRING)
	@Column(name = "planet_status", nullable = false)
	private PlanetStatus status;

	/**
	 * 행성의 생성 일자입니다.
	 * 자동으로 현재 타임스탬프로 설정됩니다.
	 */
	@CreationTimestamp
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	/**
	 * 행성 생성시 기본 제공 이미지를 선택했을 경우 해당 제공 이미지에 대한 정보입니다.
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "default_img_id", nullable = false)
	private DefaultPlanetImg defaultPlanetImg;

	/**
	 * 행성 생성시 커스텀 이미지를 선택했을 경우 해당 커스텀 이미지에 대한 정보입니다.
	 */
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "custom_planet_img_id", nullable = true)
	private CustomPlanetImg customPlanetImg;

	/**
	 * 챌린지를 인증하기 위한 예시 이미지입니다.
	 */
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "standard_verification_img_id", nullable = false)
	private StandardVerificationImg standardVerificationImg;

	/**
	 * 행성 객체를 생성하는 생성자입니다.
	 * <p>
	 * 기본 생성자이며, 행성의 현재 참가자 수를 1로 설정하고, 상태를 {@code PlanetStatus.READY}로 설정합니다.
	 * </p>
	 *
	 * @param name 행성의 이름
	 * @param category 행성의 카테고리
	 * @param content 행성의 내용
	 * @param startDate 행성의 시작 날짜
	 * @param endDate 행성의 종료 날짜
	 * @param maxParticipants 최대 참가자 수
	 * @param verificationCond 인증 조건
	 * @param customPlanetImg 커스텀 행성 이미지 (null일 수 있음)
	 * @param defaultPlanetImg 기본 행성 이미지
	 * @param standardVerificationImg 인증 예시 이미지
	 */
	@Builder
	public Planet(String name, Category category, String content, LocalDate startDate, LocalDate endDate,
		int maxParticipants, String verificationCond, CustomPlanetImg customPlanetImg,
		DefaultPlanetImg defaultPlanetImg,
		StandardVerificationImg standardVerificationImg) {
		this(name, category, content, startDate, endDate, maxParticipants, 1, verificationCond, PlanetStatus.READY,
			defaultPlanetImg, customPlanetImg, standardVerificationImg);
	}

	/**
	 * 행성 객체를 생성하는 프라이빗 생성자입니다.
	 * <p>
	 * 모든 필드를 초기화합니다. 현재 참가자 수와 상태를 포함하여 기본 값으로 설정합니다.
	 * </p>
	 *
	 * @param name 행성의 이름
	 * @param category 행성의 카테고리
	 * @param content 행성의 내용
	 * @param startDate 행성의 시작 날짜
	 * @param endDate 행성의 종료 날짜
	 * @param maxParticipants 최대 참가자 수
	 * @param currentParticipants 현재 참가자 수
	 * @param verificationCond 인증 조건
	 * @param status 행성의 상태
	 * @param defaultPlanetImg 기본 행성 이미지
	 * @param customPlanetImg 커스텀 행성 이미지 (null일 수 있음)
	 * @param standardVerificationImg 인증 예시 이미지
	 */
	private Planet(String name, Category category, String content, LocalDate startDate, LocalDate endDate,
		int maxParticipants, int currentParticipants, String verificationCond, PlanetStatus status,
		DefaultPlanetImg defaultPlanetImg,
		CustomPlanetImg customPlanetImg, StandardVerificationImg standardVerificationImg) {
		this.name = name;
		this.category = category;
		this.content = content;
		this.startDate = startDate;
		this.endDate = endDate;
		this.maxParticipants = maxParticipants;
		this.currentParticipants = currentParticipants;
		this.verificationCond = verificationCond;
		this.status = status;
		this.defaultPlanetImg = defaultPlanetImg;
		this.customPlanetImg = customPlanetImg;
		this.standardVerificationImg = standardVerificationImg;
	}

	/**
	 * 현재 행성의 참가자 수를 1 증가시킵니다.
	 * <p>
	 * 최대 참가자 수를 초과하면 {@code ParticipantsOverflowException}이 발생합니다.
	 * </p>
	 *
	 * @throws ParticipantsOverflowException 최대 참가자 수를 초과할 경우
	 */
	public void addParticipant() {
		if (currentParticipants == maxParticipants) {
			throw new ParticipantsOverflowException();
		}
		this.currentParticipants++;
	}

	/**
	 * 현재 행성의 참가자 수를 1 감소시킵니다.
	 * <p>
	 * 참가자 수가 0이 되면 행성의 상태를 {@code PlanetStatus.DESTROYED}로 변경합니다.
	 * 참가자 수가 음수가 되면 {@code NegativeParticipantCountException}이 발생합니다.
	 * </p>
	 *
	 * @throws NegativeParticipantCountException 참가자 수가 음수가 될 경우
	 */
	public void removeParticipant() {
		this.currentParticipants--;
		if (currentParticipants == 0) {
			this.status = PlanetStatus.DESTROYED;
		}
		if (currentParticipants < 0) {
			throw new NegativeParticipantCountException();
		}
	}

	/**
	 * 행성의 이미지 URL을 반환합니다.
	 * <p>
	 * 사용자 정의 이미지가 설정되어 있으면 해당 이미지의 URL을 반환하고,
	 * 그렇지 않으면 기본 이미지의 URL을 반환합니다.
	 * </p>
	 *
	 * @return 행성 이미지의 URL
	 */
	public String getPlanetImgUrl() {
		if (hasCustomImg()) {
			return this.customPlanetImg.getImgUrl();
		}
		return this.defaultPlanetImg.getImgUrl();
	}

	/**
	 * 사용자 정의 이미지가 설정되어 있는지 여부를 확인합니다.
	 *
	 * @return 사용자 정의 이미지가 설정되어 있으면 {@code true}, 그렇지 않으면 {@code false}
	 */
	private boolean hasCustomImg() {
		return customPlanetImg != null;
	}

}
