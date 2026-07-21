import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const socialAuthService = {
    /**
     * Inicializa o Google OAuth
     */
    initiateGoogleLogin: async () => {
        try {
            // Redireciona para o backend que fará o redirecionamento ao Google
            window.location.href = `${API_URL}/accounts/social-login/google/`;
        } catch (error) {
            toast.error('Erro ao iniciar login com Google');
            throw error;
        }
    },

    /**
     * Inicializa o Facebook OAuth
     */
    initiateFacebookLogin: async () => {
        try {
            window.location.href = `${API_URL}/accounts/social-login/facebook/`;
        } catch (error) {
            toast.error('Erro ao iniciar login com Facebook');
            throw error;
        }
    },

    /**
     * Inicializa o Apple OAuth
     */
    initiateAppleLogin: async () => {
        try {
            window.location.href = `${API_URL}/accounts/social-login/apple/`;
        } catch (error) {
            toast.error('Erro ao iniciar login com Apple');
            throw error;
        }
    },

    /**
     * Verifica se há token de autenticação após callback OAuth
     */
    handleOAuthCallback: async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const refreshToken = urlParams.get('refresh');
            const error = urlParams.get('error');

            if (error) {
                throw new Error(error);
            }

            if (token && refreshToken) {
                // Armazena tokens
                localStorage.setItem('access_token', token);
                localStorage.setItem('refresh_token', refreshToken);

                // Limpa URL
                window.history.replaceState({}, document.title, window.location.pathname);

                return { token, refreshToken };
            }

            return null;
        } catch (error) {
            toast.error('Erro ao processar callback OAuth');
            throw error;
        }
    },

    /**
     * Faz login direto com token OAuth do frontend
     */
    loginWithOAuthToken: async (provider, token) => {
        try {
            const response = await axios.post(
                `${API_URL}/accounts/social-login/`,
                {
                    provider,
                    token,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.access_token && response.data.refresh_token) {
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);

                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }

                return response.data;
            }

            throw new Error('Token não retornado');
        } catch (error) {
            toast.error('Erro ao fazer login com OAuth');
            throw error;
        }
    },

    /**
     * Faz logout
     */
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    /**
     * Obtém o usuário logado
     */
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Verifica se está autenticado
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },

    /**
     * Obtém o token de acesso
     */
    getAccessToken: () => {
        return localStorage.getItem('access_token');
    },
};

export default socialAuthService;
