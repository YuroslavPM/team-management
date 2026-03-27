import type { ChatType } from "./chatEnum";

export type ChatMessage = {
    type: typeof ChatType.MESSAGE;
    message: string;
    username: string;
    timestamp:string;
}
export type TypingEvent = {
    type: typeof ChatType.TYPING;
    username: string
}
export type UserListEvent = {
    type: typeof ChatType.USER_LIST;
    users: string[];
}
export type ChatEvent = ChatMessage | TypingEvent | UserListEvent;

export type SendMessagePayload = {
    type: typeof ChatType.MESSAGE;
    message: string;
}

export type SendTypingPayload = {
    type: typeof ChatType.TYPING;
}