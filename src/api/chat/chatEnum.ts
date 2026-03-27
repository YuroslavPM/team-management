export const ChatType = {
  MESSAGE: "chat_message",
  TYPING: "typing",
  USER_LIST: "user_list",
} as const;
export type ChatTypeValues = (typeof ChatType)[keyof typeof ChatType];
