import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../api/chat/chatController";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { getRandomColorByString } from "../utils/helpers/randomColor";

export const ChatPage = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [inputValue, setInputValue] = useState("");
  const { messages, typingUser, activeUsers, sendMessage, sendTyping } =
    useChat(roomName || "general");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
    sendTyping();
  };

  return (
    <Box sx={{ display: "flex", gap: 2, height: "80vh", width:"900px" }}>
      <Paper
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography>Room: {roomName}</Typography>
        <Divider />
        <Box sx={{ flexGrow: 1, overflowY: "auto", py: 2, px: 1 }}>
          <List>
            {messages.map((msg, i) => (
              <ListItem
                key={i}
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: 12,
                      bgcolor: getRandomColorByString(msg.username[0]),
                    }}
                  >
                    {msg.username[0]}
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    {msg.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(msg.timestamp).toLocaleDateString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    bgcolor: "#f5f5f5",
                    borderRadius: "0px 15px 15px 15px",
                    maxWidth: "80&",
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                </Paper>
              </ListItem>
            ))}
            <Box ref={scrollRef} />
          </List>
        </Box>
        <Box sx={{ height: 20, mb: 1 }}>
          {typingUser && (
            <Typography
              variant="caption"
              color="primary"
              sx={{ fontSize: "italic" }}
            >
              {typingUser} is typing...
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Write a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={handleKeyUp}
            variant="outlined"
            size="small"
          >
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              <SendIcon />
            </IconButton>
          </TextField>
        </Box>
      </Paper>
      <Paper
        sx={{
          width: 200,
          p: 2,
          borderRadius: 2,
          display: { xs: "none", md: "block" },
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
          ACTIVE USERS ({activeUsers.length})
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {activeUsers.map((user) => (
            <Chip
              key={user}
              label={user}
              size="small"
              variant="outlined"
              avatar={
                <Avatar sx={{ bgcolor: getRandomColorByString(user) }}>{user[0]}</Avatar>
              }
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};
