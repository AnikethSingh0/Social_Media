const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function readJson(res) {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function apiFetch(path, opts = {}) {
  const { headers = {}, ...rest } = opts;
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...authHeaders(), ...headers },
    ...rest,
  });
  const data = await readJson(res);
  return { res, data };
}

export async function signup({ email, password, username, fullName }) {
  return apiFetch('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username, fullName }),
  });
}

export async function login({ email, password }) {
  return apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export function getGoogleAuthUrl() {
  return `${API_BASE}/auth/google`;
}

export async function fetchTweets(offset = 0, limit = 10) {
  return apiFetch(`/tweets?offset=${offset}&limit=${limit}`);
}

export async function createTweet(content, mediaFile) {
  const formData = new FormData();
  formData.append('content', content);
  if (mediaFile) formData.append('media', mediaFile);

  const res = await fetch(`${API_BASE}/tweet`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData,
  });
  const data = await readJson(res);
  return { res, data };
}

export async function fetchComments(tweetId) {
  return apiFetch(`/comments/${tweetId}`);
}

export async function createComment(tweetId, content) {
  return apiFetch(`/comments/${tweetId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}

export async function fetchReplies(commentId) {
  return apiFetch(`/comments/replies/${commentId}`);
}

export async function createReply(tweetId, parentCommentId, content) {
  return apiFetch(`/comments/reply/${tweetId}/${parentCommentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}

export async function toggleLike(modelType, modelId) {
  return apiFetch(`/likes/toggle/${modelType}/${modelId}`, {
    method: 'POST'
  });
}
