import React, { useState, useEffect } from 'react';
import api from '../../api';
import StreamCard from '../../components/streamCard';

const Home = () => {
    const [streams, setStreams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStreams = async () => {
            try {
                const response = await api.get('streams/');
                setStreams(response.data);
            } catch (error) {
                console.error("Erro ao buscar streams:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStreams();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 ">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Canais que recomendamos</h1>
            
            {streams.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-inner">
                    <p className="text-gray-500 text-lg">Nenhuma stream ativa no momento. Que tal abrir a sua?</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {streams.map((stream) => (
                        <StreamCard key={stream.id} stream={stream} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
