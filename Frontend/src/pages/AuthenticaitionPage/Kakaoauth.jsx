import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Kakao API 받아오는 과정
function Auth() {
  const navigate = useNavigate();
  const REST_API_KEY = import.meta.env.VITE_REST_API_KEY; // REST API KEY
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI; // Redirect URI

  // Kakao에 axios 요청을 날려서 API_KEY와 REDIRECT_URI를 활용해 access_token을 받아온다.
  const getToken = async () => {
    const token = new URL(window.location.href).searchParams.get("code");
    const res = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: token,
      }),
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    return res.data;
  };
  
  // 백엔드로 받아온 access_token을 넘긴다.
  const sendTokenToBackend = async (accessToken) => {
    try {
      const res = await axios.post(
        "http://70.12.247.69:8080/api/v1/members/auth/login/kakao", // 백엔드 엔드포인트
        { accessToken: accessToken }, // accessToken을 포함한 요청 바디
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // 백엔드에서 받은 응답 처리
      console.log("Backend response:", res.data);

      // 응답 데이터에서 accessToken과 refreshToken을 추출하여 sessionStorage에 저장
      const { accessToken: backendAccessToken, refreshToken } = res.data.data;
      sessionStorage.setItem("access_token", backendAccessToken);
      sessionStorage.setItem("refresh_token", refreshToken);
      console.log(sessionStorage)

      // 메인페이지로 리다이렉트
      navigate("/main");
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
  };

  // 카카오로부터 access_token을 받아오고
  // 받아온 accss_token이 존재할 경우 백엔드로 토큰을 보낸다.
  useEffect(() => {
    getToken()
      .then((res) => {
        if (res.access_token) {
          console.log("Access Token:", res.access_token);
          sendTokenToBackend(res.access_token);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return <></>;
}

export default Auth;
