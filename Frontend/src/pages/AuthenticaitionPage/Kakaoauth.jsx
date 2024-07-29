import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; 
// npm install js-cookie 이후 Cookie 사용을 위해 import 해오는 것




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
      // secure: true인 경우 쿠키는 HTTPS를 사용하는 경우에만 서버로 전송 -> 쿠키의 전송이 암호화된 연결을 통해서만 이루어지도록
      // sameSite 옵션은 쿠키가 요청에 포함될 조건을 설정: Strict, Lax, 그리고 None
      // Strict: 쿠키가 동일한 사이트의 요청에만 포함된다.
      // Lax: 쿠키는 동일한 사이트와 크로스 사이트 간의 "안전한" 요청(GET 메서드와 함께 발생하는 탐색 요청)에만 전송
      // None: 쿠키는 모든 요청에 대해 전송됩니다. 이 옵션을 사용할 때는 반드시 secure 옵션을 true로 설정해야
      // CSRF 공격에 대비하기 위해 설정 - 원하지 않는 사이트 간 요청으로부터 보호
      Cookies.set("access_token", backendAccessToken, { secure: true, sameSite: 'Lax' });
      Cookies.set("refresh_token", refreshToken, { secure: true, sameSite: 'Lax' });
      console.log("Cookies set", Cookies.get());

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
