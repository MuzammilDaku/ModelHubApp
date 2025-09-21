import axios from 'axios';

export const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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


export const api = { getFreeModels, createChat ,createUser,getUser,getChats,getMessages};