package com.planetrush.planetrush.planet.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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

	@Column(name = "authentication_cond", nullable = false)
	private String authCond;

	@OneToMany(mappedBy = "planet")
	private final List<Resident> residents = new ArrayList<>();

	@CreationTimestamp
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Builder
	public Planet(String name, Category category, String content, LocalDate startDate, LocalDate endDate,
		int maxParticipants,
		String authCond) {
		this.name = name;
		this.category = category;
		this.content = content;
		this.startDate = startDate;
		this.endDate = endDate;
		this.maxParticipants = maxParticipants;
		this.authCond = authCond;
	}

}
