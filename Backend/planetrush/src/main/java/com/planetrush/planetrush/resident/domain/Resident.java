package com.planetrush.planetrush.resident.domain;

import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.planet.domain.Planet;

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
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "resident")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Resident {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "resident_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "planet_id")
	private Planet planet;

	@Enumerated(EnumType.STRING)
	@Column(name = "challenge_status", nullable = false)
	private ChallStatus challStatus;

	@Column(name = "is_banned", nullable = false)
	private Boolean banned;

	@Column(name = "is_creator", nullable = false)
	private Boolean creator;

	@Builder
	public Resident(Member member, Planet planet, ChallStatus challStatus) {
		this(member, planet, challStatus, false, false);
	}

	private Resident(Member member, Planet planet, ChallStatus challStatus, Boolean banned, Boolean creator) {
		addMember(member);
		addPlanet(planet);
		this.challStatus = challStatus;
		this.banned = banned;
		this.creator = creator;
	}

	private void addPlanet(Planet planet) {
		this.planet = planet;
		planet.getResidents().add(this);
	}

	private void addMember(Member member) {
		this.member = member;
		member.getResidents().add(this);
	}

}
