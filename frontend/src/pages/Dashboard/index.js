import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import colors from '../../configs/colors';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [createdStream, setCreatedStream] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        stream_type: 'rtmp',
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
        setError('');
        try {
            const response = await api.post('streams/', formData);
            setCreatedStream(response.data);
            setSuccess(true);
        } catch (error) {
            const backendErrors = error.response?.data;
            if (backendErrors && typeof backendErrors === 'object') {
                const messages = Object.keys(backendErrors).map(key => {
                    return `${key}: ${backendErrors[key]}`;
                });
                setError("Erro na validação: " + messages.join(", "));
            } else {
                setError("Erro: Verifique se você é um Streamer ou se os dados estão corretos.");
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
                
                {success && (
                    <div className="mb-4 p-3 rounded-lg text-center" style={{ backgroundColor: `${colors.status.success}20`, color: colors.status.success }}>
                        Stream criada com sucesso! Você está online.
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${colors.status.error}20`, color: colors.status.error }}>
                        {error}
                    </div>
                )}

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
                        <label className="block mb-2 font-medium" style={{ color: colors.text.primary }}>Tipo de Transmissão</label>
                        <select 
                            name="stream_type" 
                            className="w-full p-3 border rounded focus:ring-2 outline-none transition-all"
                            style={{
                                backgroundColor: colors.input.background,
                                borderColor: colors.input.border,
                                color: colors.text.primary,
                                '--tw-ring-color': colors.accent.primary,
                                '--tw-ring-offset-color': colors.input.background
                            }}
                            onChange={handleChange} 
                            value={formData.stream_type}
                        >
                            <option value="rtmp">RTMP (OBS/Streamlabs)</option>
                            <option value="youtube">YouTube</option>
                        </select>
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

                {/* RTMP Configuration Display */}
                {success && createdStream && createdStream.stream_type === 'rtmp' && (
                    <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: colors.background.tertiary }}>
                        <h3 className="font-bold mb-3" style={{ color: colors.text.primary }}>Configurações OBS/Streamlabs</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="font-semibold block mb-1" style={{ color: colors.text.secondary }}>Server:</span>
                                <code className="block p-2 rounded w-full break-all" style={{ backgroundColor: colors.input.background }}>rtmp://localhost:1935/live</code>
                            </div>
                            <div>
                                <span className="font-semibold block mb-1" style={{ color: colors.text.secondary }}>Stream Key:</span>
                                <code className="block p-2 rounded w-full break-all" style={{ backgroundColor: colors.input.background }}>{createdStream.rtmp_key}</code>
                            </div>
                            <div className="pt-2">
                                <button 
                                    onClick={() => navigate(`/live/${createdStream.slug}`)}
                                    className="px-4 py-2 rounded text-white font-semibold transition"
                                    style={{ backgroundColor: colors.accent.primary }}
                                >
                                    Ir para Live
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

};

export default Dashboard;