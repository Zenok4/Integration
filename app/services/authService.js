import API from './api';

export async function login(username, password) {
  const res = await API.post('/login', { username, password });
  return res.data;
}

export async function createUser(data) {
  const res = await API.post('/users', data);
  return res.data;
}