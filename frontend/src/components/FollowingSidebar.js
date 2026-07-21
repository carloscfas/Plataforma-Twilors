import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFollowingList } from '../api';
import colors from '../configs/colors';
import toast from 'react-hot-toast';

const FollowingSidebar = () => {
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (token) {
            fetchFollowing();
        }
    }, [token]);

    const fetchFollowing = async () => {
        setLoading(true);
        try {
            const response = await getFollowingList();
            setFollowing(response.data);
        } catch (error) {
            toast.error('Erro ao carregar canais seguidos');
        } finally {
            setLoading(false);
        }
    };

    if (!token) return null;

    return (
        <div 
            className="fixed left-0 top-0 h-full w-80 shadow-2xl z-30 flex flex-col"
            style={{ backgroundColor: colors.background.secondary, paddingTop: '64px' }}
        >
            <div className="p-4 border-b" style={{ borderColor: colors.border.primary }}>
                <h2 className="text-xl font-bold" style={{ color: colors.text.primary }}>Canais Seguidos</h2>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
                {loading ? (
                    <div className="text-center py-8" style={{ color: colors.text.secondary }}>
                        Carregando...
                    </div>
                ) : following.length === 0 ? (
                    <div className="text-center py-8" style={{ color: colors.text.secondary }}>
                        Você ainda não segue nenhum canal.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {following.map((streamer) => (
                            <Link
                                key={streamer.id}
                                to={`/streamer/${streamer.username}`}
                                className="flex items-center gap-3 p-3 rounded-lg hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: colors.background.tertiary }}
                            >
                                <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: colors.accent.primary }}
                                >
                                    {streamer.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate" style={{ color: colors.text.primary }}>
                                        {streamer.username}
                                    </div>
                                    <div className="text-sm truncate" style={{ color: colors.text.secondary }}>
                                        {streamer.followers_count || 0} seguidores
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowingSidebar;
