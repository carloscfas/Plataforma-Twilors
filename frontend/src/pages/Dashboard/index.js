import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        video_url: '',
        thumbnail: ''
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
        setLoading(true);
        try {
            await api.post('streams/', formData);
            alert('Stream criada com sucesso! Você está online.');
            navigate('/');
        } catch (error) {
            console.error("Erro ao criar stream:", error.response?.data);
            
            // Lógica Sênior: Se o erro for em campos específicos (ex: URL inválida), mostramos todos
            const backendErrors = error.response?.data;
            if (backendErrors && typeof backendErrors === 'object') {
                const messages = Object.keys(backendErrors).map(key => {
                    return `${key}: ${backendErrors[key]}`;
                });
                alert("Erro na validação:\n" + messages.join("\n"));
            } else {
                alert("Erro: Verifique se você é um Streamer ou se os dados estão corretos.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-6">Painel do Streamer</h1>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Configurar Nova Live</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">Título da Live</label>
                        <input 
                            name="title" 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                            onChange={handleChange} 
                            placeholder="Ex: Gameplay de Valorant" 
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">Descrição</label>
                        <textarea 
                            name="description" 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none h-32" 
                            onChange={handleChange} 
                            placeholder="Conte sobre sua live..."
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">URL do Vídeo (Twitch Link)</label>
                        <input 
                            name="video_url" 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                            onChange={handleChange} 
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full md:w-auto px-6 py-2 rounded text-white font-bold transition ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {loading ? 'Iniciando...' : 'Iniciar Transmissão'}
                    </button>
                </form>
            </div>
        </div>
    )

};

export default Dashboard;