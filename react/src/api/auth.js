import api from './axios';

export async function register({ name, email, password }) {
  const res = await api.post('/api/auth/register', { name, email, password });
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post('/api/auth/login', { email, password });
  return res.data; // { token, member }
}
