import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getUserProfile } from '../../api';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import socialAuthService from '../../services/socialAuthService';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // O SimpleJWT do Django espera 'username' e 'password' no endpoint 'token/'
            const response = await api.post('token/', formData);
            
            // Salvamos os tokens para uso posterior pelo interceptor no api.js
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Busca os dados do usuário
            const userRes = await getUserProfile();
            localStorage.setItem('user', JSON.stringify(userRes.data));

            toast.success('Login realizado com sucesso!');
            navigate('/');
        } catch (error) {
            toast.error('Usuário ou senha incorretos.');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await socialAuthService.initiateGoogleLogin();
        } catch (error) {
            toast.error('Erro ao iniciar login com Google');
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await socialAuthService.initiateFacebookLogin();
        } catch (error) {
            toast.error('Erro ao iniciar login com Facebook');
        }
    };

    const handleAppleLogin = async () => {
        try {
            await socialAuthService.initiateAppleLogin();
        } catch (error) {
            toast.error('Erro ao iniciar login com Apple');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg w-96">
                <h2 className="text-3xl font-bold mb-6 text-center font-sans text-blue-700">Entrar na Plataforma</h2>

                <div className="mb-4">
                    <label className="block text-gray-800 text-sm font-bold mb-2">Usuário</label>
                    <input
                        name="username"
                        placeholder="Seu usuário"
                        className="w-full p-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-800 text-sm font-bold mb-2">Senha</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Sua senha"
                        className="w-full p-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold text-lg shadow-md hover:shadow-lg">
                    Entrar
                </button>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-3 text-sm text-gray-600">Ou continue com</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <SocialLoginButtons
                    onGoogleClick={handleGoogleLogin}
                    onFacebookClick={handleFacebookLogin}
                    onAppleClick={handleAppleLogin}
                />
                
                <p className="mt-4 text-center text-sm text-gray-600">
                    Não tem conta? <a href="/register" className="text-blue-600 hover:underline">Cadastre-se</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
