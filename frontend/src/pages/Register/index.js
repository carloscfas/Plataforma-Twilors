import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast'; // Importamos a nossa ponte com o backend

const Register = () => {
    const navigate = useNavigate(); // Para redirecionar o usuário depois

    // Usamos um objeto para agrupar os dados do formulário
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        is_streamer: false
    });

    // Função genérica para atualizar qualquer campo do formulário
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Fazemos a chamada para o endpoint que criamos no Django
            await api.post('accounts/register/', formData);
            toast.success('Cadastro realizado com sucesso!');
            navigate('/login');
        } catch (error) {
            toast.error('Erro ao realizar cadastro. Verifique os dados.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg w-96">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Criar Conta</h2>

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

                <div className="mb-4">
                    <label className="block text-gray-800 text-sm font-bold mb-2">E-mail</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Seu e-mail"
                        className="w-full p-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-4">
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

                <div className="flex items-center mb-6">
                    <input
                        id="is_streamer_checkbox"
                        name="is_streamer"
                        type="checkbox"
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        onChange={handleChange}
                    />
                    <label htmlFor="is_streamer_checkbox" className="text-sm text-gray-700 cursor-pointer select-none">
                        Quero ser um Streamer
                    </label>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold text-lg shadow-md hover:shadow-lg">
                    Cadastrar
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Já tem uma conta? <a href="/login" className="text-blue-600 hover:underline">Login</a>
                </p>

            </form>
        </div>
    );
};

export default Register;