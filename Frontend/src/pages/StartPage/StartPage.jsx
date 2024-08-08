import React from "react";

import kakaoLogin from "../../assets/kakao_login.png";
import "../../styles/StartPage.css";

//  카카오 로그인 화면
const SocialKakao = () => {
  const REST_API_KEY = import.meta.env.VITE_REST_API_KEY; // REST API KEY
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI; // Redirect URI

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

  //  카카오 인가 코드를 받기 위한 작업이다.
  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

  return (
    <div className="start-page">
      <div className="start-image">
        <img src="/logo/로고-배경없음.png" alt="로고" className="my-logo" />
      </div>
      <div className="kakao-login">
        <img
          src={kakaoLogin}
          alt="Kakao Talk"
          className="kakao-login"
          onClick={handleLogin}
        />
      </div>
    </div>
  );
};

export default SocialKakao;
