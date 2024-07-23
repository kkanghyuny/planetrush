package com.planetrush.planetrush.planet.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.planetrush.planetrush.image.domain.CustomPlanetImg;
import com.planetrush.planetrush.image.domain.DefaultPlanetImg;
import com.planetrush.planetrush.image.domain.StandardVerificationImg;
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

@Getter
@Entity
@Table(name = "planet")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Planet {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "planet_id")
	private Long id;

	@Column(name = "name", length = 10, nullable = false)
	private String name;

	@Enumerated(EnumType.STRING)
	@Column(name = "category", nullable = false)
	private Category category;

	@Column(name = "challenge_content", nullable = false)
	private String content;

	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	@Column(name = "end_date", nullable = false)
	private LocalDate endDate;

	@Column(name = "max_participants", nullable = false)
	private int maxParticipants;

	@Column(name = "current_participants", nullable = false)
	private int currentParticipants;

	@Column(name = "verification_cond", nullable = false)
	private String verificationCond;

	@OneToMany(mappedBy = "planet")
	private final List<Resident> residents = new ArrayList<>();

	@Enumerated(EnumType.STRING)
	@Column(name = "planet_status", nullable = false)
	private PlanetStatus status;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "default_img_id", nullable = false)
	private DefaultPlanetImg defaultPlanetImg;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "custom_planet_img_id", nullable = true)
	private CustomPlanetImg customPlanetImg;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "standard_verification_img_id", nullable = false)
	private StandardVerificationImg standardVerificationImg;

	@Builder
	public Planet(String name, Category category, String content, LocalDate startDate, LocalDate endDate,
		int maxParticipants, String verificationCond, CustomPlanetImg customPlanetImg,
		DefaultPlanetImg defaultPlanetImg,
		StandardVerificationImg standardVerificationImg) {
		this(name, category, content, startDate, endDate, maxParticipants, 1, verificationCond, PlanetStatus.READY,
			defaultPlanetImg, customPlanetImg, standardVerificationImg);
	}

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

	public void addParticipant() {
		if (currentParticipants == maxParticipants) {
			throw new ParticipantsOverflowException();
		}
		this.currentParticipants++;
	}

	public void removeParticipant() {
		this.currentParticipants--;
		if (currentParticipants == 0) {
			this.status = PlanetStatus.DESTROYED;
		}
		if (currentParticipants < 0) {
			throw new NegativeParticipantCountException();
		}
	}

	public String getPlanetImgUrl() {
		if (hasCustomImg()) {
			return this.customPlanetImg.getImgUrl();
		}
		return this.defaultPlanetImg.getImgUrl();
	}

	private boolean hasCustomImg() {
		return customPlanetImg != null;
	}

}
