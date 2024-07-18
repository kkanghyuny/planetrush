import React, { useEffect } from 'react';
import kakaoLogin from "../../assets/kakao_login.png";
import "../../styles/StartPage.css";

const SocialKakao = () => {
  const REST_API_KEY = import.meta.env.VITE_REST_API_KEY; // REST API KEY
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI; // Redirect URI

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
  
  const handleLogin = () => {
    window.location.href = kakaoURL;
  };
  
      
  return (
    <div className="kakaologin">
      <img
        src={kakaoLogin}
        alt="Kakao Talk"
        className="kakao_login"
        onClick={handleLogin}
      />
    </div>
  );
};

export default SocialKakao;

