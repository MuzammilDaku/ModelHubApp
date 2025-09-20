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
  name:string;
  id:string;
  created_by:string;
  lastUsedModel:Model;
  lastMessage:string;
  lastMessageTime:string;
}

interface chatStore {
  selectedChat:chat | null;
  models:Model[] | null;
  selectedModel:Model | null
  chats:chat[] | null
}

interface chatStoreActions {
  setModels: (models:Model[]) => void;
  setSelectedModel:(model:Model) => void;
}
interface ChatStore extends chatStore, chatStoreActions {}

const initialState: chatStore = {
  selectedChat:null,
  models:null,
  selectedModel:null,
  chats:null
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setModels:(models) => {
        set({models:models})
      },
      setSelectedModel:(model) => {
        set({selectedModel:model})
      }
      
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
