package com.planetrush.planetrush.member.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.planetrush.planetrush.member.exception.NicknameOverflowException;
import com.planetrush.planetrush.planet.domain.Resident;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "member")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "member_id")
	private Long id;

	@ElementCollection
	@CollectionTable(name = "MEMBER_AUTHORITY", joinColumns = @JoinColumn(name = "member_id"))
	private List<String> authorities = new ArrayList<>();

	@Column(name = "nickname", length = 10, nullable = false)
	private String nickname;

	@Column(name = "email", nullable = false)
	private String email;

	@Column(name = "ci", nullable = false)
	private String ci;

	@Enumerated(EnumType.STRING)
	@Column(name = "provider", nullable = false)
	private Provider provider;

	@OneToMany(mappedBy = "member")
	private List<Resident> residents = new ArrayList<>();

	@CreationTimestamp
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	@Builder
	public Member(String nickname, String email, String ci, Provider provider) {
		this.nickname = nickname;
		this.email = email;
		this.ci = ci;
		this.provider = provider;
	}

	public void updateNickname(String newNickname) {
		if (checkNicknameNull(newNickname)) {
			throw new IllegalArgumentException();
		}

		if (checkNicknameLength(newNickname)) {
			throw new NicknameOverflowException();
		}

		this.nickname = newNickname;
	}

	private boolean checkNicknameNull(String nickname) {
		return nickname == null;
	}

	private boolean checkNicknameLength(String nickname) {
		return nickname.trim().isEmpty() || nickname.length() > 10;
	}

}
