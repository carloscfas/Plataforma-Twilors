import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import api from '../../api';
import ReactPlayer from 'react-player';


const Live = () => {
    const { slug } = useParams();
    const [stream, setStream] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchStream = async () => {
            try {
                const response = await api.get(`/streams/${slug}/`);
                if (isMounted) {
                    setStream(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Erro ao buscar live:", error);
                if (isMounted) setLoading(false);
            }
        };
        fetchStream();
        return () => { isMounted = false; };
    }, [slug]);

    if (loading) return <div className="p-8 text-center">Carregando...</div>;
    if (!stream) return <div className="p-8 text-center text-red-600">Live não encontrada.</div>;

    // Função para extrair o ID do vídeo do YouTube
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    const embedUrl = getYouTubeEmbedUrl(stream.video_url);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                
                {/* ÁREA DO PLAYER - Usando Iframe Nativo (Mais robusto) */}
                <div className="bg-black aspect-video w-full">
                    {embedUrl ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={embedUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="flex items-center justify-center h-full text-white">
                            Formato de URL inválido para o player nativo.
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <h1 className="text-2xl font-bold">{stream.title}</h1>
                    <p className="text-indigo-600 font-semibold mb-4">@{stream.streamer_username}</p>
                    <div className="bg-gray-50 p-4 rounded text-gray-700">
                        {stream.description || "Sem descrição disponível."}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Live;