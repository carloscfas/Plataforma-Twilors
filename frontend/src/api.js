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

export default api;