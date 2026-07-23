import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getStreamerProfile = (username) => api.get(`accounts/streamer/${username}/`);
export const getStreamerStreams = (username) => api.get(`streams/by_streamer/?username=${username}`);
export const getUserProfile = () => api.get('accounts/profile/');
export const checkFollowStatus = (username) => api.get(`accounts/streamer/${username}/follow/`);
export const followStreamer = (username) => api.post(`accounts/streamer/${username}/follow/`);
export const unfollowStreamer = (username) => api.delete(`accounts/streamer/${username}/follow/`);
export const getFollowingList = () => api.get('accounts/following/');
export const getAllStreamers = () => api.get('accounts/streamers/');
export const getTopLives = () => api.get('streams/top_lives/');

export default api;