import React from "react";
import backGround from "../../assets/background.png";
import kakaoLogin from "../../assets/kakao_login.png";
import "../../css/StartPage.css";

function Login() {
  const SocialKakao = () => {
    const Rest_api_key = import.meta.env.VITE_REST_API_KEY; // REST API KEY
    const redirect_uri = import.meta.env.VITE_REDIRECT_URI; // Redirect URI
    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
    const handleLogin = () => {
      window.location.href = kakaoURL;
    };
    return (
      <div className="container">
        <img src={backGround} alt="Background" className="back_ground" />
        <div className="kakaologin">
          <img
            src={kakaoLogin}
            alt="Kakao Talk"
            className="kakao_login"
            onClick={handleLogin}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <SocialKakao />
    </div>
  );
}

export default Login;
