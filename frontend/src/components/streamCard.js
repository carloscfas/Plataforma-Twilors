import React from 'react';
import { Link } from "react-router-dom";

const StreamCard = ({ stream }) => {
    // Placeholder para quando não houver thumbnail
    const placeholderGradient = "bg-gradient-to-br from-accent-secondary to-accent-primary";

    return (
        <div className="block">
            <div className="bg-card-bg rounded-lg overflow-hidden hover:card-hover transition-all cursor-pointer border border-border-primary hover:border-accent-primary">
                {/* Thumbnail */}
                <Link to={`/live/${stream.slug}`}>
                    <div className={`h-48 w-full ${placeholderGradient} flex items-center justify-center relative group`}>
                        {stream.thumbnail ? (
                            <img
                                src={stream.thumbnail}
                                alt={stream.title}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <span className="text-white font-bold text-lg">LIVE</span>
                        )}

                        {stream.is_live && (
                            <span className="absolute top-2 left-2 bg-status-live text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                AO VIVO
                            </span>
                        )}
                    </div>
                </Link>

                {/* Conteúdo */}
                <div className="p-4 flex gap-3">
                    <Link 
                        to={`/streamer/${stream.streamer_username}`}
                        className="w-10 h-10 rounded-full bg-bg-elevated flex-shrink-0 flex items-center justify-center hover:bg-accent-primary transition-colors border border-border-primary"
                    >
                        {/* Placeholder para Avatar */}
                        <span className="text-text-secondary font-bold uppercase">
                            {stream.streamer_username?.charAt(0)}
                        </span>
                    </Link>

                    <div className="overflow-hidden flex-1">
                        <Link to={`/live/${stream.slug}`}>
                            <h3 className="font-bold text-text-primary truncate hover:text-accent-primary transition-colors" title={stream.title}>
                                {stream.title}
                            </h3>
                        </Link>
                        <Link to={`/streamer/${stream.streamer_username}`}>
                            <p className="text-sm text-text-secondary truncate hover:text-accent-primary transition-colors">
                                {stream.streamer_username}
                            </p>
                        </Link>
                        <p className="text-xs text-text-muted mt-1">
                            {stream.description || "Sem descrição..."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreamCard;
