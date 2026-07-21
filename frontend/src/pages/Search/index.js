import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import StreamCard from '../../components/streamCard';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState({ streams: [], streamers: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`streams/search/?q=${query}`);
                setResults(response.data);
            } catch (error) {
                console.error('Erro ao buscar resultados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
                Resultados para "{query}"
            </h1>

            {results.streamers.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Streamers</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {results.streamers.map((streamer) => (
                            <div 
                                key={streamer.id}
                                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
                                onClick={() => window.location.href = `/streamer/${streamer.username}`}
                            >
                                <div className="flex items-center gap-4">
                                    {streamer.avatar ? (
                                        <img 
                                            src={streamer.avatar} 
                                            alt={streamer.username}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-2xl">👤</span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{streamer.username}</h3>
                                        {streamer.bio && (
                                            <p className="text-sm text-gray-600 line-clamp-2">{streamer.bio}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {results.streams.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Streams</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {results.streams.map((stream) => (
                            <StreamCard key={stream.id} stream={stream} />
                        ))}
                    </div>
                </div>
            )}

            {results.streams.length === 0 && results.streamers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-inner">
                    <p className="text-gray-500 text-lg">Nenhum resultado encontrado para "{query}"</p>
                </div>
            )}
        </div>
    );
};

export default Search;
