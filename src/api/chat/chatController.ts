import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatEvent, ChatMessage } from "./chatTypes";
import { ChatType } from "./chatEnum";
import { useGetAllUsers } from "../userController";

export const useChat = (roomName: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const { data: allUsers } = useGetAllUsers();

  const socketRef = useRef<WebSocket | null>(null);
  const lastTypingSignal = useRef<number>(0);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const socketUrl = `ws://localhost:8000/ws/chat/${roomName}/`;
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data: ChatEvent = JSON.parse(event.data);
      switch (data.type) {
        case ChatType.MESSAGE:
          setMessages((prev) => [...prev, data]);
          setTypingUser(null);
          break;

        case ChatType.TYPING:
          setTypingUser(data.username);
          if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
          typingTimerRef.current = setTimeout(() => setTypingUser(null), 3000);
          break;

        case ChatType.USER_LIST:
          setActiveUsers(data.users);
          break;
      }
    };

    socket.onclose = () => console.log("Websocket Disconnected");
    socket.onerror = (err) => console.log(`Websocket Error ${err}`);

    return () => {
      socket.close();
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [roomName]);

  const sendMessage = useCallback((message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: ChatType.MESSAGE,
          message,
        }),
      );
    }
  }, []);

  const sendTyping = useCallback(() => {
    const now = Date.now();
    if (now - lastTypingSignal.current > 3000) {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: ChatType.TYPING }));
        lastTypingSignal.current = now;
      }
    }
  }, []);

  return {
    messages,
    typingUser,
    activeUsers,
    sendMessage,
    sendTyping,
  };
};
