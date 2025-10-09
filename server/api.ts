import axios from 'axios';

export const apiUrl = 'https://modelhub-api.vercel.app/api';

export const API = axios.create({
  baseURL: apiUrl,
});

const getFreeModels = async () => {
  try {
    const response = await fetch(`${apiUrl}/free-models`);
    return response.json();
  } catch (error) {
    console.log('Error fetching free models:', error);
  }
};

const createChat = async (chat: {
  name: string;
  id?: string;
  createdBy: string;
  lastUsedModel: string;
  lastMessage?: string;
  lastMessageTime?: string;
}) => {
  const response = await API.post('/chat/create', chat);
  return response.data;
};


const createUser = async ({email}:{email:string}) => {
  const response = await API.post('/user/create', {email});
  return response.data;
}


const getUser = async(email:string) => {
  const response = await API.post('/user',{email});
  return response.data;
}


const getChats = async (id:string) => {
  const response = await API.post('/chat',{id})
  return response.data;
}


const getMessages = async (id:string) => {
  const response = await API.get(`/chat/messages?id=${id}`)
  return response.data;
}

const deleteAllChats = async (userId: string) => {
  try {
    const response = await API.delete(`/chat/delete-all`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting all chats:', error);
    throw error;
  }
}

const deleteChat = async (chatId: string) => {
  try {
    const response = await API.delete(`/chat/${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
}

export const api = { getFreeModels, createChat ,createUser,getUser,getChats,getMessages, deleteAllChats, deleteChat};