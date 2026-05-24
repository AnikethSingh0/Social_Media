const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// ── Token helpers ──────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('token');
export const setToken = (t) => localStorage.setItem('token', t);
export const removeToken = () => localStorage.removeItem('token');

const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// ── Generic fetcher ────────────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  const { headers = {}, ...rest } = opts;
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...authHeaders(), ...headers },
    ...rest,
  });
  const data = await res.json();
  return { res, data };
}

// ── Auth ───────────────────────────────────────────────────────────────────────
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

// ── Tweets ─────────────────────────────────────────────────────────────────────
export async function fetchTweets(offset = 0, limit = 10) {
  return apiFetch(`/tweets?offset=${offset}&limit=${limit}`);
}

export async function createTweet(content, mediaFile) {
  const fd = new FormData();
  fd.append('content', content);
  if (mediaFile) fd.append('media', mediaFile);

  const res = await fetch(`${API_BASE}/tweet`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: fd,
  });
  const data = await res.json();
  return { res, data };
}

// ── Comments ───────────────────────────────────────────────────────────────────
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
