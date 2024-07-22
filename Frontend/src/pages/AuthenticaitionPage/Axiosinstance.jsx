import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Axios 인스턴스 생성
const instance = axios.create({
  baseURL: 'http://70.12.114.73:8080/api/v1',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `${accessToken}`;
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
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post('http://70.12.247.69:8080/api/v1/members/auth/refresh', {
            refreshToken: refreshToken,
          });
          const { accessToken: newAccessToken } = res.data;
          sessionStorage.setItem('access_token', newAccessToken);
          axios.defaults.headers.common['Authorization'] = `${newAccessToken}`;
          originalRequest.headers['Authorization'] = `${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error('Error refreshing access token:', refreshError);
          // 토큰 갱신 실패 시 로그아웃 처리
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('refresh_token');
          // 리디렉션 또는 로그아웃 로직 추가
          useNavigate()('/');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
