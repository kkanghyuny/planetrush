import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();
  const REST_API_KEY = import.meta.env.VITE_REST_API_KEY; // REST API KEY
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI; // Redirect URI

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

      // 응답 데이터에서 accessToken과 refreshToken을 추출하여 localStorage에 저장
      const { accessToken: backendAccessToken, refreshToken } = res.data.data;
      sessionStorage.setItem("access_token", backendAccessToken);
      sessionStorage.setItem("refresh_token", refreshToken);
      console.log(sessionStorage)

      // 원하는 경로로 리다이렉트
      navigate("/main");
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
  };

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
