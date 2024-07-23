package com.planetrush.planetrush.member.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.planetrush.planetrush.member.exception.AlreadyWithdrawnException;
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
	@CollectionTable(name = "member_authority", joinColumns = @JoinColumn(name = "member_id"))
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

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private Status status;

	@OneToMany(mappedBy = "member")
	private List<Resident> residents = new ArrayList<>();

	@CreationTimestamp
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	@Builder
	public Member(String nickname, String email, String ci, Provider provider, Status status) {
		this.nickname = nickname;
		this.email = email;
		this.ci = ci;
		this.provider = provider;
		this.status = status;
	}

	/**
	 * 유저의 닉네임을 변경합니다.
	 * @param newNickname 변경할 닉네임
	 */
	public void updateNickname(String newNickname) {
		if (checkNicknameNull(newNickname)) {
			throw new IllegalArgumentException();
		}

		if (checkNicknameLength(newNickname)) {
			throw new NicknameOverflowException();
		}

		this.nickname = newNickname;
	}

	/**
	 * 변경할 닉네임이 null인지 확인합니다.
	 * @param nickname 변경할 닉네임
	 * @return null 여부
	 */
	private boolean checkNicknameNull(String nickname) {
		return nickname == null;
	}

	/**
	 * 변경할 닉네임의 길이를 확인합니다.
	 * @param nickname 변경할 닉네임
	 * @return 10글자 초과 또는 비어있는지 여부
	 */
	private boolean checkNicknameLength(String nickname) {
		return nickname.trim().isEmpty() || nickname.length() > 10;
	}

	/**
	 * 회원을 탈퇴시키며 상태를 INACTIVE로 변경합니다.
	 *
	 * @throws AlreadyWithdrawnException 이미 탈퇴한 회원일 때 발생
	 */
	public void withdrawn() {
		if (alreadyWithdrawn()) {
			throw new AlreadyWithdrawnException();
		}
		this.status = Status.INACTIVE;
	}

	/**
	 * 이미 탈퇴한 회원인지 확인합니다.
	 * @return 회원의 탈퇴 여부
	 */
	private boolean alreadyWithdrawn() {
		return this.status.equals(Status.INACTIVE);
	}
}
