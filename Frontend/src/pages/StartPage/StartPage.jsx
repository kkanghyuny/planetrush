import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import kakaoLogin from "../../assets/kakao_login.png";
import "../../styles/StartPage.css";

const SocialKakao = () => {
  const REST_API_KEY = import.meta.env.VITE_REST_API_KEY; // REST API KEY
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI; // Redirect URI
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 리다이렉트 수행
  const location = useLocation(); // 현재 위치 정보를 가져오기 위해 useLocation 사용

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

  // 카카오 인가 코드를 받기 위한 작업이다.
  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

  useEffect(() => {
    const accessToken = Cookies.get("access-token");
    const refreshToken = Cookies.get("refresh-token");

    // access-token과 refresh-token이 존재하면서 현재 경로가 스타트 페이지가 아닌 경우 리다이렉트
    if (accessToken && refreshToken && location.pathname !== "/") {
      navigate("/main"); // 이전 페이지로 이동
    }
  }, [navigate, location]);

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
