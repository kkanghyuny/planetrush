import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import instance from "../../pages/AuthenticaitionPage/Axiosinstance";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    // accessToken이나 resfreshToken이 없는 경우 로그인 안 한 것으로 간주
    if (!accessToken || !refreshToken) {
      console.error("No tokens found. User is not logged in.");
      return;
    }

    try {
      const res = await instance.post(
        "/members/auth/logout/kakao", // 백엔드 로그아웃 엔드포인트
        { refreshToken }, // 요청 바디에 refreshToken 포함
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // 헤더에 accessToken 포함
          },
        }
      );

      console.log(Cookies.get("access_token"));
      console.log(Cookies.get("refresh_token"));
      console.log("Logout response:", res.data);

      // 로그아웃이 성공적으로 이루어진 경우 쿠키를 삭제하고 로그인 페이지로 리다이렉트
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      console.log(Cookies.get("access_token"));
      console.log(Cookies.get("refresh_token"));

      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
