import React, { useState, useEffect } from 'react';
import { checkFollowStatus, followStreamer, unfollowStreamer } from '../api';
import toast from 'react-hot-toast';

const FollowButton = ({ username }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwnProfile = user.username === username;

    useEffect(() => {
        const loadFollowStatus = async () => {
            try {
                const res = await checkFollowStatus(username);
                setIsFollowing(res.data.is_following);
                setFollowersCount(res.data.followers_count);
            } catch (err) {
                toast.error('Erro ao carregar status de follow');
            } finally {
                setLoading(false);
            }
        };

        if (!isOwnProfile) {
            loadFollowStatus();
        } else {
            setLoading(false);
        }
    }, [username, isOwnProfile]);

    const handleFollowClick = async () => {
        if (isFollowing) {
            try {
                const res = await unfollowStreamer(username);
                setIsFollowing(false);
                setFollowersCount(res.data.followers_count);
            } catch (err) {
                toast.error('Erro ao deixar de seguir');
            }
        } else {
            try {
                const res = await followStreamer(username);
                setIsFollowing(true);
                setFollowersCount(res.data.followers_count);
            } catch (err) {
                toast.error('Erro ao seguir');
            }
        }
    };

    if (isOwnProfile || loading) {
        return null;
    }

    if (!user.id) {
        return (
            <div className="text-center text-sm text-gray-500">
                <a href="/login" className="text-purple-500 hover:underline">
                    Faça login para seguir
                </a>
            </div>
        );
    }

    return (
        <div className="text-center">
            <button
                onClick={handleFollowClick}
                className={`px-6 py-3 rounded-lg transition font-semibold ${
                    isFollowing
                        ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
            >
                {isFollowing ? '✓ Seguindo' : '+ Seguir'}
            </button>
            <p className="text-sm text-gray-600 mt-3">
                {followersCount} {followersCount === 1 ? 'seguidor' : 'seguidores'}
            </p>
        </div>
    );
};

export default FollowButton;
