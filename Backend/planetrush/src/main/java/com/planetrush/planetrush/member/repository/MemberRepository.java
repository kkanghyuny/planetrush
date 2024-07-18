package com.planetrush.planetrush.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.member.domain.Provider;

public interface MemberRepository extends JpaRepository<Member, Long> {

	Member findByEmailAndProvider(String email, Provider provider);

}
