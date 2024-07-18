package com.planetrush.planetrush.planet.domain;

import com.planetrush.planetrush.member.domain.Member;

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
	@Column(name = "challenger_status", nullable = false)
	private ChallengerStatus challengerStatus;

	@Column(name = "is_banned", nullable = false)
	private Boolean banned;

	@Column(name = "is_creator", nullable = false)
	private Boolean creator;

	private Resident(Member member, Planet planet, ChallengerStatus challengerStatus, Boolean banned, Boolean creator) {
		addMember(member);
		addPlanet(planet);
		this.challengerStatus = challengerStatus;
		this.banned = banned;
		this.creator = creator;
	}

	public static Resident isNotCreator(Member member, Planet planet) {
		return new Resident(member, planet, ChallengerStatus.READY, false, false);
	}

	public static Resident isCreator(Member member, Planet planet) {
		return new Resident(member, planet, ChallengerStatus.READY, false, true);
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
