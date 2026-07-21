import React, { useState, useEffect } from 'react';
import api from '../../api';
import StreamCard from '../../components/streamCard';
import colors from '../../configs/colors';
import toast from 'react-hot-toast';

const categories = [
    { id: 1, name: 'Just Chatting', emoji: '💬', color: 'from-purple-500 to-indigo-600' },
    { id: 2, name: 'Gaming', emoji: '🎮', color: 'from-green-500 to-teal-600' },
    { id: 3, name: 'Music', emoji: '🎵', color: 'from-pink-500 to-rose-600' },
    { id: 4, name: 'Sports', emoji: '⚽', color: 'from-orange-500 to-amber-600' },
    { id: 5, name: 'Art', emoji: '🎨', color: 'from-blue-500 to-cyan-600' },
    { id: 6, name: 'Technology', emoji: '💻', color: 'from-gray-500 to-slate-600' },
];

const Home = () => {
    const [streams, setStreams] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    useEffect(() => {
        const fetchStreams = async () => {
            try {
                const response = await api.get('streams/');
                setStreams(response.data);
            } catch (error) {
                toast.error('Erro ao buscar streams');
            } finally {
                setLoading(false);
            }
        };

        fetchStreams();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.accent.primary }}></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Saudação Personalizada */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                    {getGreeting()}, {user?.username || 'visitante'} 👋
                </h1>
                <p className="mt-1" style={{ color: colors.text.secondary }}>Descubra os melhores canais para você</p>
            </div>

            {/* Canais que recomendamos */}
            <section className="mb-12">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: colors.text.primary }}>
                    <span style={{ color: colors.accent.primary }}>🔥</span> Canais que recomendamos
                </h2>
                
                {streams.length === 0 ? (
                    <div className="text-center py-12 rounded-lg border" style={{ backgroundColor: colors.card.background, borderColor: colors.border.primary }}>
                        <p className="text-lg" style={{ color: colors.text.secondary }}>Nenhuma stream ativa no momento. Que tal abrir a sua?</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {streams.map((stream) => (
                            <StreamCard key={stream.id} stream={stream} />
                        ))}
                    </div>
                )}
            </section>

            {/* Explorar Categorias */}
            <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: colors.text.primary }}>
                    <span style={{ color: colors.accent.primary }}>🎯</span> Explorar Categorias
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="rounded-lg p-4 border transition-all cursor-pointer group"
                            style={{
                                backgroundColor: colors.card.background,
                                borderColor: colors.border.primary
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = colors.accent.primary;
                                e.currentTarget.style.backgroundColor = colors.card.hover;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = colors.border.primary;
                                e.currentTarget.style.backgroundColor = colors.card.background;
                            }}
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform" style={{ backgroundImage: category.color }}>
                                {category.emoji}
                            </div>
                            <h3 className="font-medium text-sm transition-colors" style={{ color: colors.text.primary }}>
                                {category.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
