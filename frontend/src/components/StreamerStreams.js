import React from 'react';
import { Link } from 'react-router-dom';
import StreamCard from './streamCard';

const StreamerStreams = ({ streams, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!streams || streams.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">
                    Este streamer ainda não tem streams. Volte mais tarde!
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-white-900 mb-6">
                Streams Anteriores ({streams.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {streams.map((stream) => (
                    <Link
                        key={stream.slug}
                        to={`/live/${stream.slug}`}
                        className="transform hover:scale-105 transition-transform"
                    >
                        <StreamCard stream={stream} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default StreamerStreams;
