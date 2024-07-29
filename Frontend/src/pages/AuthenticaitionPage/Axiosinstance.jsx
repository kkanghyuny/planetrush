import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // js-cookie import


// Axios 인스턴스 생성
// 1초 시간을 걸어서 시간 내 응답이 안 될 시 에러로 판명
const instance = axios.create({
  baseURL: 'http://70.12.114.73:8080/api/v1', // 기본 URL 설정
  timeout: 1000, // 요청 제한 시간 1초 설정
  headers: {
    'Content-Type': 'application/json', // 기본 헤더 설정
  }
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
  (config) => {

    // 쿠키에서 액세스 토큰 가져오기
    const accessToken = Cookies.get('access_token');
 
    if (accessToken) {
      // 액세스 토큰이 존재하면 Authorization 헤더에 추가
      config.headers['Authorization'] = `${accessToken}`; 
    }

    console.log(config.headers)

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
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // 무한 루프 방지를 위해 _retry 플래그 설정
      originalRequest._retry = true;
      // 쿠키에서 리프레시 토큰 가져오기
      const refreshToken = Cookies.get('refresh_token');

      if (refreshToken) {
        try {
          // 리프레시 토큰을 사용하여 새로운 액세스 토큰 요청
          const res = await axios.post('http://70.12.247.69:8080/api/v1/members/auth/refresh', {
            refreshToken: refreshToken,
          });
          const { accessToken: newAccessToken } = res.data; // 새로운 액세스 토큰 가져오기
          Cookies.set('access_token', newAccessToken, { secure: true, sameSite: 'strict' }); // 새로운 액세스 토큰을 쿠키에 저장
          axios.defaults.headers.common['Authorization'] = `${newAccessToken}`; // 기본 헤더에 새로운 액세스 토큰 설정
          originalRequest.headers['Authorization'] = `${newAccessToken}`; // 원래 요청 헤더에 새로운 액세스 토큰 설정
          return axios(originalRequest); // 원래 요청 다시 시도
        } catch (refreshError) {
          console.error('Error refreshing access token:', refreshError); // 리프레시 토큰 요청 에러 로그
          // 토큰 갱신 실패 시 로그아웃 처리
          Cookies.remove('access_token'); // 쿠키에서 액세스 토큰 제거
          Cookies.remove('refresh_token'); // 쿠키에서 리프레시 토큰 제거
          // 리디렉션 또는 로그아웃 로직 추가
          useNavigate()('/'); // 홈 페이지로 리디렉션
        }
      }
    }
    return Promise.reject(error); // 다른 에러 발생 시 에러 반환
  }
);

export default instance; // 설정된 Axios 인스턴스 내보내기
