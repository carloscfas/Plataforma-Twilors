import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStreamerProfile, getStreamerStreams } from '../../api';
import StreamerInfo from '../../components/StreamerInfo';
import StreamerStreams from '../../components/StreamerStreams';

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
                console.error('Erro ao carregar dados do streamer:', err);
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Erro
                    </h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <a
                        href="/"
                        className="inline-block bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                        Voltar para Home
                    </a>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header com background */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-lg h-40 mb-0"></div>

                {/* Perfil do Streamer */}
                <div className="mb-12 -mt-20">
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
