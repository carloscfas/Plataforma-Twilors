import React from 'react';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

const StreamerInfo = ({ streamer, isOwnProfile }) => {
    if (!streamer) return null;

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="relative h-44 w-full bg-gray-100">
                {streamer.banner ? (
                    <img
                        src={streamer.banner}
                        alt="Banner do streamer"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white text-lg font-semibold">
                        Banner padrão do streamer
                    </div>
                )}
            </div>
            <div className="p-8">
                <div className="flex items-center gap-8 justify-between">
                    <div className="flex items-center gap-8 flex-1">
                        {/* Avatar */}
                        <div className="flex-shrink-0 -mt-16">
                        {streamer.avatar ? (
                            <img
                                src={streamer.avatar}
                                alt={streamer.username}
                                className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-lg"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold">
                                {streamer.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold text-gray-900">
                                {streamer.first_name && streamer.last_name
                                    ? `${streamer.first_name} ${streamer.last_name}`
                                    : streamer.username}
                            </h1>
                            {streamer.is_streamer && (
                                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Streamer
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 text-lg mb-2">@{streamer.username}</p>

                        {streamer.bio && (
                            <p className="text-gray-700 text-base max-w-2xl mb-4">
                                {streamer.bio}
                            </p>
                        )}

                        <p className="text-gray-500 text-sm">
                            Email: {streamer.email}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4">
                    {isOwnProfile && user.is_streamer && (
                        <Link
                            to="/edit-profile"
                            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition whitespace-nowrap text-center"
                        >
                            ✎ Editar Perfil
                        </Link>
                    )}
                    {!isOwnProfile && (
                        <FollowButton username={streamer.username} />
                    )}
                </div>
            </div>

            {/* Social Accounts */}
            {streamer.social_accounts && streamer.social_accounts.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Contas Vinculadas
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {streamer.social_accounts.map((account) => (
                            <div
                                key={account.id}
                                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg"
                            >
                                <span className="text-sm font-semibold text-gray-700 capitalize">
                                    {account.provider}
                                </span>
                                {account.picture_url && (
                                    <img
                                        src={account.picture_url}
                                        alt={account.provider}
                                        className="w-6 h-6 rounded-full"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StreamerInfo;
