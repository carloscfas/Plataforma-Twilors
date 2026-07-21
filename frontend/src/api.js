import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/'
})

// Aqui entra o Interceptor (A mágica)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
});

// Funções de Streamer
export const getStreamerProfile = (username) => {
    return api.get(`accounts/streamer/${username}/`);
};

export const getStreamerStreams = (username) => {
    return api.get(`streams/by_streamer/?username=${username}`);
};

// Funções de Usuário
export const getUserProfile = () => {
    return api.get(`accounts/profile/`);
};

// Funções de Follow
export const checkFollowStatus = (username) => {
    return api.get(`accounts/streamer/${username}/follow/`);
};

export const followStreamer = (username) => {
    return api.post(`accounts/streamer/${username}/follow/`);
};

export const unfollowStreamer = (username) => {
    return api.delete(`accounts/streamer/${username}/follow/`);
};

export const getFollowingList = () => {
    return api.get(`accounts/following/`);
};

export const getAllStreamers = () => {
    return api.get(`accounts/streamers/`);
};

export default api;