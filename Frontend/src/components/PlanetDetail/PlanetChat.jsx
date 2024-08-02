import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { Stomp } from "@stomp/stompjs";

const CHAT_URL = "http://i11a509.p.ssafy.io/api/v2/chat";

const PlanetChat = ({ planetInfo, resident }) => {
  const stompClient = useRef(null);
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

    console.log(data);
  };

  useEffect(() => {
    connect();
    fetchMessages();
    return () => disconnect();
  }, []);

  // 웹소켓 연결 설정
  const connect = () => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(`/sub/chatroom/1`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
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
        id: 1,
        name: "테스트1",
        message: inputValue,
      };
      stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
      setInputValue("");
    }
  };

  return (
    <div>
      <ul>
        {messages.map((item, index) => (
          <div key={index} className="list-item">
            {item.message}
          </div>
        ))}
        <div>
          <input type="text" value={inputValue} onChange={handleInputChange} />
          <button onClick={sendMessage}>입력</button>
        </div>
      </ul>
    </div>
  );
};

export default PlanetChat;
