import React from 'react';
import { Link } from "react-router-dom";

const StreamCard = ({ stream }) => {
    // Placeholder para quando não houver thumbnail
    const placeholderColor = "bg-gradient-to-br from-blue-400 to-indigo-600";

    return (
        <div className="block">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer">
                {/* Thumbnail */}
                <Link to={`/live/${stream.slug}`}>
                    <div className={`h-48 w-full ${placeholderColor} flex items-center justify-center relative`}>
                        {stream.thumbnail ? (
                            <img
                                src={stream.thumbnail}
                                alt={stream.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-white font-bold text-lg">LIVE</span>
                        )}

                        {stream.is_live && (
                            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                AO VIVO
                            </span>
                        )}
                    </div>
                </Link>

                {/* Conteúdo */}
                <div className="p-4 flex gap-3">
                    <Link 
                        to={`/streamer/${stream.streamer_username}`}
                        className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center hover:bg-gray-300 transition"
                    >
                        {/* Placeholder para Avatar */}
                        <span className="text-gray-500 font-bold uppercase">
                            {stream.streamer_username?.charAt(0)}
                        </span>
                    </Link>

                    <div className="overflow-hidden flex-1">
                        <Link to={`/live/${stream.slug}`}>
                            <h3 className="font-bold text-gray-900 truncate hover:text-blue-600 transition" title={stream.title}>
                                {stream.title}
                            </h3>
                        </Link>
                        <Link to={`/streamer/${stream.streamer_username}`}>
                            <p className="text-sm text-gray-600 truncate hover:text-blue-600 transition">
                                {stream.streamer_username}
                            </p>
                        </Link>
                        <p className="text-xs text-gray-400 mt-1">
                            {stream.description || "Sem descrição..."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreamCard;
