import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import "../../styles/PlanetChat.css";

const CHAT_URL = "https://i11a509.p.ssafy.io:8080/chat/v2";
const LOCAL = "http://70.12.247.69:8002/chat/v2";

const PlanetChat = ({ planetId, planetInfo, residents }) => {
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // console.log(residents);

  //접속 유저의 id
  const memberId = residents
    .filter((resident) => resident.isQuerriedMember)
    .map((resident) => resident.memberId)[0];

  // 기존 채팅 메시지를 서버로부터 가져오는 함수
  const fetchMessages = async () => {
    const response = await axios.get(LOCAL, {
      params: { "planet-id": planetId },
    });

    const data = response.data;
    setMessages(data);

    console.log(data);
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
    const socket = new SockJS("http://70.12.247.69:8002/ws");
    stompClient.current = Stomp.over(socket);

    console.log(stompClient);

    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(
        `/sub/planet${planetId}`,
        (message) => {
          const newMessage = JSON.parse(message.body);

          console.log(newMessage);

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

  //메세지 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const getAvatarUrl = (name) => {
  //   return `https://www.dicebear.com/styles/bottts-neutral/${name}.svg`;
  // };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`list-item ${
              item.memberId === memberId ? "my-message" : "other-message"
            }`}
          >
            {/* <img
              src={getAvatarUrl(item.name)}
              alt={item.name}
              className="avatar"
            /> */}
            <div className="message-content">
              <div className="message-header">
                <span className="message-name">
                  {item.nickname || "Unknown"}
                </span>
                <span className="message-time">
                  {new Date(item.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-text">{item.content}</div>
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
          onKeyUp={handleInputChange}
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
