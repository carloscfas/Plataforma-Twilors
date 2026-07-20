import React from 'react';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';
import colors from '../configs/colors';

const StreamerInfo = ({ streamer, isOwnProfile }) => {
    if (!streamer) return null;

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="rounded-lg shadow-md overflow-hidden mb-8" style={{ backgroundColor: colors.background.secondary }}>
            <div className="relative h-44 w-full" style={{ backgroundColor: colors.background.tertiary }}>
                {streamer.banner ? (
                    <img
                        src={streamer.banner}
                        alt="Banner do streamer"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-semibold" style={{ background: colors.gradient.primary, color: colors.text.primary }}>
                        Banner padrão do streamer
                    </div>
                )}
                {/* Avatar */}
                <div className="absolute -bottom-16 left-8">
                    {streamer.avatar ? (
                        <img
                            src={streamer.avatar}
                            alt={streamer.username}
                            className="w-32 h-32 rounded-full object-cover border-4 shadow-lg"
                            style={{ borderColor: colors.accent.primary }}
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold" style={{ background: colors.gradient.primary, color: colors.text.primary }}>
                            {streamer.username?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            </div>
            <div className="p-8 pt-20">
                <div className="flex items-center gap-8 justify-between">
                    <div className="flex items-center gap-8 flex-1 ml-40">

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold" style={{ color: colors.text.primary }}>
                                    {streamer.first_name && streamer.last_name
                                        ? `${streamer.first_name} ${streamer.last_name}`
                                        : streamer.username}
                                </h1>
                                {streamer.is_streamer && (
                                    <span className="text-white px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: colors.accent.primary }}>
                                        Streamer
                                    </span>
                                )}
                            </div>

                            <p className="text-lg mb-2" style={{ color: colors.text.secondary }}>@{streamer.username}</p>

                            <p className="text-sm" style={{ color: colors.text.muted }}>
                                Email: {streamer.email}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        {isOwnProfile && user.is_streamer && (
                            <Link
                                to="/edit-profile"
                                className="text-white px-6 py-3 rounded-lg transition whitespace-nowrap text-center"
                                style={{ backgroundColor: colors.accent.primary }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = colors.accent.hover}
                                onMouseLeave={(e) => e.target.style.backgroundColor = colors.accent.primary}
                            >
                                ✎ Editar Perfil
                            </Link>
                        )}
                        {!isOwnProfile && (
                            <FollowButton username={streamer.username} />
                        )}
                    </div>
                </div>
            </div>

            {/* Bio */}
            {streamer.bio && (
                <div className="mt-6 p-6 rounded-xl" style={{ backgroundColor: colors.background.tertiary, borderColor: colors.border.primary }}>
                    <h3 className="text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>
                        Sobre mim
                    </h3>
                    <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: colors.text.secondary }}>
                        {streamer.bio}
                    </p>
                </div>
            )}

            {/* Social Accounts */}
            {streamer.social_accounts && streamer.social_accounts.length > 0 && (
                <div className="mt-8 pt-8 border-t" style={{ borderColor: colors.border.primary }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
                        Contas Vinculadas
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {streamer.social_accounts.map((account) => (
                            <div
                                key={account.id}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                                style={{ backgroundColor: colors.background.tertiary }}
                            >
                                <span className="text-sm font-semibold capitalize" style={{ color: colors.text.primary }}>
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
