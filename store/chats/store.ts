import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Model {
  id: string;
  canonical_slug: string;
  hugging_face_id: string | null;
  name: string;
  created: number;
  description: string;
  context_length: number;
  architecture: {
    modality: string;
    input_modalities: string[];
    output_modalities: string[];
    tokenizer: string;
    instruct_type: string | null;
  };
  pricing: {
    prompt: string;
    completion: string;
    request: string;
    image: string;
    web_search: string;
    internal_reasoning: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number | null;
    is_moderated: boolean;
  };
  per_request_limits: unknown | null;
  supported_parameters: string[];
  icon: string;
}

export interface chat {
  name: string;
  id: string;
  createdBy: string;
  lastUsedModel: string;
  lastMessage: string;
  lastMessageTime: string;
}

export interface Message {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  messageType: string;
}

interface chatStore {
  selectedChat: chat | null;
  models: Model[] | null;
  selectedModel: Model | null;
  chats: chat[] | null;
  selectedChatMessages: Message[] | null;
}

interface chatStoreActions {
  setModels: (models: Model[]) => void;
  addChat: (chat: chat) => void;
  setSelectedModel: (model: Model) => void;
  setChats: (chats: chat[]) => void;
  setSelectedChat: (chat: chat) => void;
  setSelectedChatMessages: (message: Message[]) => void;
  addChatMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
}

interface ChatStore extends chatStore, chatStoreActions {}

const initialState: chatStore = {
  selectedChat: null,
  models: null,
  selectedModel: null,
  chats: null,
  selectedChatMessages: null,
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setModels: (models) => {
        set({ models: models });
      },
      setSelectedModel: (model) => {
        set({ selectedModel: model });
      },
      addChat(chat) {
        set({ chats: [...(get().chats ?? []), chat] });
      },
      setChats(chats) {
        set({ chats });
      },
      setSelectedChat(chat) {
        set({ selectedChat: chat });
      },
      setSelectedChatMessages(messages) {
        set({ selectedChatMessages: messages });
      },
      addChatMessage: (message) => {
        console.log(message)
        set({
          selectedChatMessages: [...(get().selectedChatMessages ?? []), message],
        });
      },
      updateMessage: (messageId, updates) => {
        const currentMessages = get().selectedChatMessages;
        if (!currentMessages) return;

        const updatedMessages = currentMessages.map((message) =>
          message.id === messageId
            ? { ...message, ...updates }
            : message
        );

        set({ selectedChatMessages: updatedMessages });
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);