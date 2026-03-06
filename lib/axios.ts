// lib/axios.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api', // replace with your backend URL
  // baseURL: 'http://10.0.2.2:5000/api',
    // baseURL: 'http://192.168.1.113:5000/api', 
    // baseURL:"https://37c9-2400-74e0-0-15d2-c53d-731c-aa3d-e359.ngrok-free.app/api",
    baseURL:"https://enthusiastic-emotion-production-f0cf.up.railway.app/api",
    // baseURL:'http://172.20.10.2:5000/api',



  

  withCredentials: true,
});

// Attach token automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
