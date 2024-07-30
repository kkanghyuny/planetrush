import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import instance from "../../pages/AuthenticaitionPage/Axiosinstance";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = Cookies.get("access-token");
    const refreshToken = Cookies.get("refresh-token");

    // accessToken이나 refreshToken이 없는 경우 로그인 안 한 것으로 간주
    if (!accessToken || !refreshToken) {
      console.error("No tokens found. User is not logged in.");
      return;
    }

    try {
      console.log(accessToken)
      console.log(refreshToken)
      const response = await instance.post(
        "members/auth/logout/kakao", // 백엔드 엔드포인트
        { refreshToken }, // 요청 바디에 refreshToken 포함
        {
          headers: {
            'Authorization': `${accessToken}`, // 인증 토큰을 헤더에 추가
            'Content-Type': 'application/json', // 필요한 경우 Content-Type 설정
          }
        }
      );

      console.log(Cookies.get("access-token"));
      console.log(Cookies.get("refresh-token"));
      console.log("Logout response:", response.data);

      // 로그아웃이 성공적으로 이루어진 경우 쿠키를 삭제하고 로그인 페이지로 리다이렉트
      Cookies.remove("access-token");
      Cookies.remove("refresh-token");

      console.log(Cookies.get("access-token"));
      console.log(Cookies.get("refresh-token"));

      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
