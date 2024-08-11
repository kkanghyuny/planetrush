import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";

import "../../styles/PlanetChat.css";

const CHAT_URL = "i11a509.p.ssafy.io";

// 유니코드 문자열을 Base64로 변환하는 함수
function toBase64(str) {
  return window.btoa(encodeURIComponent(str));
}

const PlanetChat = ({ planetId, residents }) => {
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [avatarUris, setAvatarUris] = useState({});

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 기존 채팅 메시지를 서버로부터 가져오는 함수
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`https://${CHAT_URL}/chat/v2`, {
        params: { "planet-id": planetId },
      });

      const data = response.data.data.map((message) => {
        const [year, month, day] = message.createdAt;

        return {
          ...message,
          createdAt: new Date(year, month - 1, day), // 배열을 Date 객체로 변환
        };
      });

      setMessages(data);
    } catch (error) {
      alert("채팅내역을 불러올 수 없습니다");
    }
  };

  useEffect(() => {
    connect();
    fetchMessages();

    return () => {
      disconnect();
    };
  }, []);

  // 웹소켓 연결 설정
  const connect = () => {
    const socket = new SockJS(`https://${CHAT_URL}/wss`);
    stompClient.current = Stomp.over(() => socket); // factory 함수 전달

    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(
        `/sub/planet${planetId}`,
        (message) => {
          const newMessage = JSON.parse(message.body);

          setMessages((prevMessages) => [...prevMessages, newMessage]);
          scrollToBottom();
        },
        (error) => {
          console.error("STOMP connection error:", error);
        }
      );
    });
  };

  // 웹소켓 연결 해제
  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };

  //메세지 전송
  const sendMessage = async () => {
    if (stompClient.current && inputValue) {
      const body = {
        memberId: memberId,
        content: inputValue,
        planetId: planetId,
      };

      // 웹소켓을 통해 메시지 전송
      stompClient.current.send(`/app/send`, {}, JSON.stringify(body));
      setInputValue("");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  //메세지 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //접속 유저의 id
  const memberId = residents
    .filter((resident) => resident.isQuerriedMember)
    .map((resident) => resident.memberId)[0];

  // 아바타 생성
  useEffect(() => {
    const generateAvatars = () => {
      const uris = {};

      residents.forEach((resident) => {
        const avatar = createAvatar(botttsNeutral, {
          seed: resident.memberId, // 고유한 아바타를 위해 memberId 사용
          randomizeIds: true, // ID 충돌 방지를 위해 true 설정
          backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"][
            Math.floor(Math.random() * 5)
          ], // 무작위 배경색 선택
          eyes: ["bulging", "dizzy", "eva", "glow", "robocop"][
            Math.floor(Math.random() * 5)
          ], // 무작위 눈 선택
          mouth: ["smile02", "square01", "square02", "diagram", "bite"][
            Math.floor(Math.random() * 5)
          ], // 무작위 입 선택
        });

        const svg = avatar.toString();
        const uri = `data:image/svg+xml;base64,${toBase64(svg)}`;
        uris[resident.memberId] = uri;
      });

      setAvatarUris(uris);
    };

    generateAvatars();
  }, [residents]);

  return (
    <div className="chat-container">
      {messages.map((item, index) => (
        <div
          key={index}
          className={`list-item ${
            item.memberId === memberId ? "my-message" : "other-message"
          }`}
        >
          <div className="message-content">
            <div className="message-header">
              <img
                src={avatarUris[item.memberId]} // 미리 생성된 아바타 URI 사용
                alt={item.name}
                className="avatar"
              />
              <span className="message-name">{item.nickname || "Unknown"}</span>
              <span className="message-time">
                {new Date(item.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-text">{item.content}</div>
          </div>
        </div>
      ))}
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleEnter}
          className="chat-input"
          placeholder="채팅을 입력해주세요"
        />
        <button onClick={sendMessage} className="send-button">
          입력
        </button>
      </div>
    </div>
  );
};

export default PlanetChat;
