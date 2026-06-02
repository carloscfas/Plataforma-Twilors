import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Importamos a nossa ponte com o backend

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
            alert('Cadastro realizado com sucesso!');
            navigate('/login'); // Redireciona para o Login
        } catch (error) {
            console.error("Erro ao cadastrar:", error.response?.data);
            alert('Erro ao realizar cadastro. Verifique os dados.')
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>

                <input
                    name="username"
                    placeholder="Usuário"
                    className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Senha"
                    className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                    required
                />

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

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
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