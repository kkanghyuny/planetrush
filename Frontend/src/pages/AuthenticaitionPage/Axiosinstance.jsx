import axios from "axios";
import Cookies from "js-cookie"; // js-cookie import

// Axios 인스턴스 생성
const DEV_URL = "http://i11a509.p.ssafy.io:8080/api/v1";
const TEST_URL = "https://www.hanserver.site";
const LOCAL_URL = "http://70.12.247.69:8080/api/v1";

const instance = axios.create({
  baseURL: DEV_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("access-token");

    if (accessToken) {
      config.headers["Authorization"] = `${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
instance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      console.log("에러 발생해서 토큰 재발급 진행");
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refresh-token");

      if (refreshToken) {
        try {
          console.log("Attempting to refresh token");
          // 토큰 재발급 요청
          const responseAgain = await axios.post(
            `${DEV_URL}/members/auth/reissue`,
            {
              refreshToken: refreshToken,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          console.log("Token refresh response:", responseAgain.data);

          const againData = responseAgain.data.data;
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            againData;
          console.log(newAccessToken);
          console.log(newRefreshToken);
          // 새로운 토큰을 쿠키에 저장
          Cookies.set("access-token", newAccessToken, {
            secure: true,
            sameSite: "strict",
          });

          Cookies.set("refresh-token", newRefreshToken, {
            secure: true,
            sameSite: "strict",
          });

          // Axios 기본 헤더와 원래 요청 헤더에 새로운 토큰 설정
          instance.defaults.headers.common[
            "Authorization"
          ] = `${newAccessToken}`;
          originalRequest.headers["Authorization"] = `${newAccessToken}`;

          console.log("New access token set in headers:", newAccessToken);

          return instance(originalRequest);
        } catch (refreshError) {
          console.error("Error refreshing access token:", refreshError);

          // 토큰 갱신 실패 시 로그아웃 처리
          Cookies.remove("access-token");
          Cookies.remove("refresh-token");

          window.location.href = "/"; // 홈 페이지로 리디렉션
        }
      }
    }
    return Promise.reject(error); // 다른 에러 발생 시 에러 반환
  }
);

export default instance; // 설정된 Axios 인스턴스 내보내기
