import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFollowingList, getAllStreamers } from '../api';
import colors from '../configs/colors';

const FollowingSidebar = () => {
    const [following, setFollowing] = useState([]);
    const [allStreamers, setAllStreamers] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [followingRes, streamersRes] = await Promise.all([
                getFollowingList(),
                getAllStreamers()
            ]);
            setFollowing(followingRes.data);
            setAllStreamers(streamersRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
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
                <h2 className="text-xl font-bold" style={{ color: colors.text.primary }}>Canais</h2>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
                {loading ? (
                    <div className="text-center py-8" style={{ color: colors.text.secondary }}>
                        Carregando...
                    </div>
                ) : (
                    <>
                        {/* Seguindo */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: colors.text.secondary }}>
                                Seguindo
                            </h3>
                            {following.length === 0 ? (
                                <div className="text-center py-4 text-sm" style={{ color: colors.text.muted }}>
                                    Você ainda não segue nenhum canal.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {following.map((streamer) => (
                                        <Link
                                            key={`following-${streamer.id}`}
                                            to={`/streamer/${streamer.username}`}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:opacity-80 transition-opacity"
                                            style={{ backgroundColor: colors.background.tertiary }}
                                        >
                                            <div 
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                                style={{ backgroundColor: colors.accent.primary }}
                                            >
                                                {streamer.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm truncate" style={{ color: colors.text.primary }}>
                                                    {streamer.username}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Todos os Streamers */}
                        <div>
                            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: colors.text.secondary }}>
                                Todos os Streamers
                            </h3>
                            {allStreamers.length === 0 ? (
                                <div className="text-center py-4 text-sm" style={{ color: colors.text.muted }}>
                                    Nenhum streamer encontrado.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {allStreamers.map((streamer) => (
                                        <Link
                                            key={`streamer-${streamer.id}`}
                                            to={`/streamer/${streamer.username}`}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:opacity-80 transition-opacity"
                                            style={{ backgroundColor: colors.background.tertiary }}
                                        >
                                            <div 
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                                style={{ backgroundColor: colors.accent.primary }}
                                            >
                                                {streamer.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm truncate" style={{ color: colors.text.primary }}>
                                                    {streamer.username}
                                                </div>
                                                <div className="text-xs truncate" style={{ color: colors.text.secondary }}>
                                                    {streamer.followers_count || 0} seguidores
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FollowingSidebar;
