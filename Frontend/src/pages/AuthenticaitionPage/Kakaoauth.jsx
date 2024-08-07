import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";

import useUserStore from "../../store/userStore";

const DEV_URL = "http://i11a509.p.ssafy.io:8002/api/v1";
const LOCAL_URL = "http://70.12.247.69:8080/api/v1";
const SERVER_URL = "http://planetrush:8080/api/v1";

// Kakao API 받아오는 과정
function Auth() {
  const navigate = useNavigate();

  const { setNickname } = useUserStore(); // zustand의 setNickname 함수 사용

  const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

  // Kakao에 axios 요청을 날려서 API_KEY와 REDIRECT_URI를 활용해 access_token을 받아온다.
  const getToken = async () => {
    const token = new URL(window.location.href).searchParams.get("code");

    const response = await axios.post(
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
    return response.data;
  };

  // 백엔드로 받아온 access_token을 넘긴다.
  const sendTokenToBackend = async (accessToken) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/members/auth/login/kakao`,
        { accessToken: accessToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 응답 데이터에서 accessToken과 refreshToken, nickname을 추출하여 sessionStorage에 저장
      const {
        accessToken: backendAccessToken,
        refreshToken,
        nickname,
      } = response.data.data;

      Cookies.set("access-token", backendAccessToken, {
        secure: true,
        sameSite: "Lax",
      });

      Cookies.set("refresh-token", refreshToken, {
        secure: true,
        sameSite: "Lax",
      });

      Cookies.set("nickname", nickname, { secure: true, sameSite: "Lax" });
      setNickname(nickname);

      // 메인페이지로 리다이렉트
      navigate("/main");
    } catch (error) {}
  };

  // 받아온 accss_token이 존재할 경우 백엔드로 토큰을 보낸다.
  useEffect(() => {
    getToken()
      .then((response) => {
        if (response.access_token) {
          sendTokenToBackend(response.access_token);
        }
      })
      .catch();
  }, []);

  return <></>;
}

export default Auth;
