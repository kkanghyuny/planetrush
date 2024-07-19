package com.planetrush.planetrush.member.service;

import com.planetrush.planetrush.member.service.dto.LoginDto;

public interface OAuthService {

	LoginDto kakaoLogin(String accessToken);

	void kakaoLogout(String memberId);
}
