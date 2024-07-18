package com.planetrush.planetrush.member.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planetrush.planetrush.core.jwt.JwtTokenProvider;
import com.planetrush.planetrush.core.jwt.dto.JwtToken;
import com.planetrush.planetrush.infra.oauth.dto.KakaoUserInfo;
import com.planetrush.planetrush.infra.oauth.util.KakaoUtil;
import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.member.domain.Provider;
import com.planetrush.planetrush.member.repository.MemberRepository;
import com.planetrush.planetrush.member.service.dto.LoginDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional
@Service
public class OAuthServiceImpl implements OAuthService {

	private final KakaoUtil kakaoUtil;
	private final JwtTokenProvider jwtTokenProvider;
	private final MemberRepository memberRepository;

	@Override
	public LoginDto kakaoLogin(String accessToken) {
		KakaoUserInfo kakaoUserInfo = kakaoUtil.getUserInfo(accessToken);
		Member member = memberRepository.findByEmailAndProvider(kakaoUserInfo.getEmail(), Provider.KAKAO);
		/* 회원가입 진행 */
		if (member == null) {
			member = memberRepository.save(Member.builder()
				.email(kakaoUserInfo.getEmail())
				.nickname("랜덤")  // TODO: 랜덤 닉네임 생성기 추가
				.provider(Provider.KAKAO)
				.build());
		}
		/* 로그인 */
		JwtToken jwtToken = jwtTokenProvider.createToken(member.getId());
		return LoginDto.builder()
			.accessToken(jwtToken.getAccessToken())
			.refreshToken(jwtToken.getRefreshToken())
			.build();
	}

}
