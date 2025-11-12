import api from './axios';

export async function getProfile() {
  const res = await api.get('/api/profile');
  return res.data;
}

export async function updateProfile({ name, email }) {
  const res = await api.put('/api/profile', { name, email });
  return res.data;
}

export async function changePassword({ old_password, new_password }) {
  const res = await api.post('/api/password/change', { old_password, new_password });
  return res.data;
}
