import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import colors from '../../configs/colors';

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
            <h1 className="text-3xl font-bold mb-6" style={{ color: colors.text.primary }}>Painel do Streamer</h1>
            <div className="p-6 rounded-lg shadow-md max-w-2xl" style={{ backgroundColor: colors.background.secondary }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>Configurar Nova Live</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium" style={{ color: colors.text.primary }}>Título da Live</label>
                        <input 
                            name="title" 
                            className="w-full p-3 border rounded focus:ring-2 outline-none transition-all"
                            style={{
                                backgroundColor: colors.input.background,
                                borderColor: colors.input.border,
                                color: colors.text.primary,
                                '--tw-ring-color': colors.accent.primary,
                                '--tw-ring-offset-color': colors.input.background
                            }}
                            onChange={handleChange} 
                            placeholder="Ex: Gameplay de Valorant" 
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium" style={{ color: colors.text.primary }}>Descrição</label>
                        <textarea 
                            name="description" 
                            className="w-full p-3 border rounded focus:ring-2 outline-none h-32 transition-all"
                            style={{
                                backgroundColor: colors.input.background,
                                borderColor: colors.input.border,
                                color: colors.text.primary,
                                '--tw-ring-color': colors.accent.primary,
                                '--tw-ring-offset-color': colors.input.background
                            }}
                            onChange={handleChange} 
                            placeholder="Conte sobre sua live..."
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium" style={{ color: colors.text.primary }}>URL do Vídeo (YouTube Link)</label>
                        <input 
                            name="video_url" 
                            className="w-full p-3 border rounded focus:ring-2 outline-none transition-all"
                            style={{
                                backgroundColor: colors.input.background,
                                borderColor: colors.input.border,
                                color: colors.text.primary,
                                '--tw-ring-color': colors.accent.primary,
                                '--tw-ring-offset-color': colors.input.background
                            }}
                            onChange={handleChange} 
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-6 py-3 rounded text-white font-bold transition shadow-md"
                        style={{
                            backgroundColor: loading ? colors.text.muted : colors.status.success,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Iniciando...' : 'Iniciar Transmissão'}
                    </button>
                </form>
            </div>
        </div>
    )

};

export default Dashboard;