import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Auth() {
    const navigate = useNavigate();
    const REST_API_KEY = import.meta.env.VITE_REST_API_KEY; // REST API KEY
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI; // Redirect URI
    const getToken = async () => {
      const token = new URL(window.location.href).searchParams.get("code");
      const res = axios.post(
        "https://kauth.kakao.com/oauth/token",
        {
          grant_type: "authorization_code",
          client_id: REST_API_KEY,
          redirect_uri: REDIRECT_URI,
          code: token,
        },
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
      return res;
    };
  
    useEffect(() => {
      getToken()
        .then((res) => {
          if (res) {
            console.log(res)
          }
        })
        .catch((err) => console.log(err));
    }, []);
  
    return <></>;
  }
  
  export default Auth;