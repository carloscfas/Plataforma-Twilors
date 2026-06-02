import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

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

            alert('Login realizado com sucesso!');
            navigate('/'); // Vai para a Home
        } catch (error) {
            console.error("Erro ao logar:", error.response?.data);
            alert('Usuário ou senha incorretos.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center font-sans">Entrar na Plataforma</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Usuário</label>
                    <input
                        name="username"
                        placeholder="Seu usuário"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Sua senha"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200">
                    Entrar
                </button>
                
                <p className="mt-4 text-center text-sm text-gray-600">
                    Não tem conta? <a href="/register" className="text-blue-600 hover:underline">Cadastre-se</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
