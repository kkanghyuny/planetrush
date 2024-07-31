import axios from "axios";
import Cookies from "js-cookie"; // js-cookie import
import { useNavigate } from "react-router-dom";

// Axios 인스턴스 생성
const devURL = 'http://i11a509.p.ssafy.io:8080/api/v1';
const SIMURL = 'https://www.hanserver.site';
const instance = axios.create({
  baseURL: devURL, // 기본 URL 설정
  timeout: 1000, // 요청 제한 시간 1초 설정
  headers: {
    "Content-Type": "application/json", // 기본 헤더 설정
  },
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
  (config) => {
    // 쿠키에서 액세스 토큰 가져오기
    const accessToken = Cookies.get("access-token");

    if (accessToken) {
      // 액세스 토큰이 존재하면 Authorization 헤더에 추가
      config.headers["Authorization"] = `${accessToken}`;
    }
    return config; // 설정된 config 반환
  },
  (error) => {
    return Promise.reject(error); // 요청 에러 발생 시 에러 반환
  }
);

// 응답 인터셉터 설정
instance.interceptors.response.use(
  (response) => {
    return response; // 정상 응답 시 응답 반환
  },
  async (error) => {
    const originalRequest = error.config; // 원래 요청 저장
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // 무한 루프 방지를 위해 _retry 플래그 설정
      originalRequest._retry = true;
      // 쿠키에서 리프레시 토큰 가져오기
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          // 리프레시 토큰을 사용하여 새로운 액세스 토큰 요청
          const responseAgain = await axios.post(`${devURL}/members/auth/reissue`, 
          {
            refreshToken: refreshToken,
          }, 
          {
            headers: {'Content-Type': 'application/json'}
          });

          const againData = responseAgain.data.data; // 응답 데이터 구조 확인
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = againData; // 새로운 토큰 가져오기

          // 새로운 토큰을 쿠키에 저장
          Cookies.set('access_token', newAccessToken, { secure: true, sameSite: 'strict' });
          Cookies.set('refresh_token', newRefreshToken, { secure: true, sameSite: 'strict' });

          // Axios 기본 헤더와 원래 요청 헤더에 새로운 토큰 설정
          instance.defaults.headers.common['Authorization'] = `${newAccessToken}`;
          originalRequest.headers['Authorization'] = `${newAccessToken}`;

          return instance(originalRequest); // 원래 요청 다시 시도
        } catch (refreshError) {
          console.error("Error refreshing access token:", refreshError); // 리프레시 토큰 요청 에러 로그
          // 토큰 갱신 실패 시 로그아웃 처리
          Cookies.remove('access_token'); // 쿠키에서 액세스 토큰 제거
          Cookies.remove('refresh_token'); // 쿠키에서 리프레시 토큰 제거
          window.location.href = '/'; // 홈 페이지로 리디렉션
        }
      }
    }
    return Promise.reject(error); // 다른 에러 발생 시 에러 반환
  }
);

export default instance; // 설정된 Axios 인스턴스 내보내기
