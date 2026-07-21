import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStreamerProfile, getStreamerStreams } from '../../api';
import StreamerInfo from '../../components/StreamerInfo';
import StreamerStreams from '../../components/StreamerStreams';
import colors from '../../configs/colors';
import toast from 'react-hot-toast';

const StreamerProfile = () => {
    const { username } = useParams();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwnProfile = user.username === username;

    const [streamer, setStreamer] = useState(null);
    const [streams, setStreams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadStreamerData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Buscar perfil do streamer
                const profileRes = await getStreamerProfile(username);
                setStreamer(profileRes.data);

                // Buscar streams do streamer
                const streamsRes = await getStreamerStreams(username);
                setStreams(streamsRes.data);
            } catch (err) {
                toast.error('Erro ao carregar dados do streamer');
                setError(
                    err.response?.data?.error ||
                    'Erro ao carregar perfil do streamer'
                );
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            loadStreamerData();
        }
    }, [username]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background.primary }}>
                <div className="rounded-lg shadow-md p-8 text-center max-w-md" style={{ backgroundColor: colors.background.secondary }}>
                    <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>
                        Erro
                    </h1>
                    <p className="mb-6" style={{ color: colors.text.secondary }}>{error}</p>
                    <a
                        href="/"
                        className="inline-block text-white px-6 py-2 rounded-lg transition-colors"
                        style={{ backgroundColor: colors.accent.primary }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = colors.accent.hover}
                        onMouseLeave={(e) => e.target.style.backgroundColor = colors.accent.primary}
                    >
                        Voltar para Home
                    </a>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background.primary }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.accent.primary }}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: colors.background.primary }}>
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Perfil do Streamer */}
                <div className="mb-12">
                    {streamer && (
                        <StreamerInfo 
                            streamer={streamer}
                            isOwnProfile={isOwnProfile}
                        />
                    )}
                </div>

                {/* Streams */}
                <StreamerStreams streams={streams} loading={loading} />
            </div>
        </div>
    );
};

export default StreamerProfile;
