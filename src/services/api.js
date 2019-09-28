import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.39.5.57:3333',
});

export default api;
