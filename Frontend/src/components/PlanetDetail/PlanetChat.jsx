import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { Stomp } from "@stomp/stompjs";

import "../../styles/PlanetChat.css";

const CHAT_URL = "http://i11a509.p.ssafy.io/api/v2/chat";

const PlanetChat = ({ planetInfo, resident }) => {
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const planetId = planetInfo.planetId;

  // 기존 채팅 메시지를 서버로부터 가져오는 함수
  const fetchMessages = async () => {
    const response = await axios.get(`${CHAT_URL}`, {
      params: { "planet-id": planetId },
    });

    const data = response.data;
    setMessages(data);
  };

  useEffect(() => {
    connect();
    fetchMessages();

    return () => disconnect();
  }, []);

  // 웹소켓 연결 설정
  const connect = () => {
    const socket = new WebSocket("ws://i11a509.p.ssafy.io:8080");
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(`/sub/chatroom/1`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        scrollToBottom();
      });
    });
  };

  // 웹소켓 연결 해제
  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };

  //메세지 전송
  const sendMessage = () => {
    if (stompClient.current && inputValue) {
      const body = {
        id: resident.id,
        name: resident.name,
        message: inputValue,
      };
      stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
      setInputValue("");
    }
  };

  //메세지 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAvatarUrl = (name) => {
    return `https://www.dicebear.com/styles/bottts-neutral/${name}.svg`;
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`list-item ${
              item.name === resident.name ? "my-message" : "other-message"
            }`}
          >
            <img
              src={getAvatarUrl(item.name)}
              alt={item.name}
              className="avatar"
            />
            <div className="message-content">
              <div className="message-header">
                <span className="message-name">{item.name}</span>
                <span className="message-time">07:00</span>{" "}
              </div>
              <div className="message-text">{item.message}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
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
