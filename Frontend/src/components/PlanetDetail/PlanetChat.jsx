import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";

import "../../styles/PlanetChat.css";

const CHAT_URL = "i11a509.p.ssafy.io";

const PlanetChat = ({ planetId, residents }) => {
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [avatarUris, setAvatarUris] = useState({});

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`https://${CHAT_URL}/chat/v2`, {
        params: { "planet-id": planetId },
      });

      const data = response.data.map((message) => {
        const [year, month, day, hour, minute, second] = message.createdAt;

        return {
          ...message,
          createdAt: new Date(year, month - 1, day, hour, minute, second),
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

  const connect = () => {
    const socket = new SockJS(`https://${CHAT_URL}/wss`);
    stompClient.current = Stomp.over(() => socket);

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

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };

  const sendMessage = async () => {
    if (stompClient.current && inputValue) {
      const body = {
        memberId: memberId,
        content: inputValue,
        planetId: planetId,
      };

      stompClient.current.send(`/app/send`, {}, JSON.stringify(body));
      setInputValue("");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const memberId = residents
    .filter((resident) => resident.isQuerriedMember)
    .map((resident) => resident.memberId)[0];

  useEffect(() => {
    const generateAvatars = () => {
      const uris = {};

      residents.forEach((resident) => {
        const backgroundColor = [
          "b6e3f4",
          "c0aede",
          "d1d4f9",
          "ffd5dc",
          "ffdfbf",
        ][Math.floor(Math.random() * 5)];
        const eyes = ["bulging", "dizzy", "eva", "glow", "robocop"][
          Math.floor(Math.random() * 5)
        ];
        const mouth = ["smile02", "square01", "square02", "diagram", "bite"][
          Math.floor(Math.random() * 5)
        ];

        const avatar = createAvatar(botttsNeutral, {
          seed: resident.memberId,
          backgroundColor: [backgroundColor],
          eyes: [eyes],
          mouth: [mouth],
        });

        const svg = avatar.toString();

        const uri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
        uris[resident.memberId] = uri;
      });

      setAvatarUris(uris);
    };

    generateAvatars();
  }, [residents]);

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
            <div className="message-content">
              <div className="message-header">
                <img
                  src={avatarUris[item.memberId]}
                  alt={item.name}
                  className="avatar"
                />
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
