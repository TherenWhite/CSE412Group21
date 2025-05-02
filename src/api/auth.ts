import axios from 'axios';
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { 'Content-Type':'application/json' },
});

export const authApi = {
  register: (data: { email:string, password:string, zip_code:string, budget:number }) =>
    API.post('/auth/register', data),
  login:    (creds: { email:string, password:string }) =>
    API.post('/auth/login', creds),
  getCurrentUser: () =>
    API.get('/auth/me'),
};
