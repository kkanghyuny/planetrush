import React from "react";
import kakaoIcon from "../../assets/kakao_icon.png";
import backGround from "../../assets/background.png";

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
        <div className="centered">
          <button className="kakaologin_button" onClick={handleLogin}>
            <img src={kakaoIcon} alt="Kakao Talk" className="kakao_icon" />
            카카오 로그인
          </button>
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
