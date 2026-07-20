import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import api from '../../api';
import colors from '../../configs/colors';

const Live = () => {
    const { slug } = useParams();
    const [stream, setStream] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estados do Chat
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);

    // Scroll automático para a última mensagem
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

        // Configuração do WebSocket para o Chat
        const connectWebSocket = () => {
            const token = localStorage.getItem('access_token');
            const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
            const wsUrl = `${wsProtocol}://localhost:8000/ws/chat/${slug}/?token=${token || ''}`;
            
            if (socketRef.current) {
                socketRef.current.close();
            }

            socketRef.current = new WebSocket(wsUrl);

            socketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (isMounted) {
                    setMessages((prev) => [...prev, data]);
                }
            };

            socketRef.current.onclose = (e) => {
                console.log("WebSocket desconectado. Tentando reconectar em 3 segundos...", e.reason);
                if (isMounted) {
                    setTimeout(connectWebSocket, 3000);
                }
            };

            socketRef.current.onerror = (err) => {
                console.error("Erro no WebSocket:", err);
                socketRef.current.close();
            };
        };

        connectWebSocket();

        return () => {
            isMounted = false;
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [slug]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (chatInput.trim() && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                'message': chatInput
            }));
            setChatInput("");
        }
    };

    if (loading) return <div className="p-8 text-center" style={{ color: colors.text.primary }}>Carregando...</div>;
    if (!stream) return <div className="p-8 text-center" style={{ color: colors.status.error }}>Live não encontrada.</div>;

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
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* LADO ESQUERDO: PLAYER E INFO */}
                <div className="flex-1">
                    <div className="bg-black aspect-video w-full rounded-lg shadow-2xl overflow-hidden">
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
                                Formato de URL inválido ou inexistente.
                            </div>
                        )}
                    </div>

                    <div className="mt-6 p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.background.secondary }}>
                        <h1 className="text-3xl font-bold" style={{ color: colors.text.primary }}>{stream.title}</h1>
                        <p className="font-bold text-lg mt-1" style={{ color: colors.accent.primary }}>@{stream.streamer_username}</p>
                        <hr className="my-4" style={{ borderColor: colors.border.primary }} />
                        <div className="leading-relaxed" style={{ color: colors.text.secondary }}>
                            {stream.description || "Nenhuma descrição fornecida para esta live."}
                        </div>
                    </div>
                </div>

                {/* LADO DIREITO: CHAT */}
                <div className="w-full lg:w-96 flex flex-col rounded-lg shadow-xl border overflow-hidden" style={{ height: '600px', backgroundColor: colors.background.secondary, borderColor: colors.border.primary }}>
                    <div className="p-4 border-b" style={{ backgroundColor: colors.background.tertiary, borderColor: colors.border.primary }}>
                        <h2 className="font-bold uppercase tracking-wider text-sm" style={{ color: colors.text.primary }}>Chat da Transmissão</h2>
                    </div>

                    {/* ÁREA DE MENSAGENS */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: colors.background.primary }}>
                        {messages.length === 0 && (
                            <p className="text-center text-sm mt-4 italic" style={{ color: colors.text.muted }}>Seja o primeiro a comentar!</p>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className="animate-fade-in-up">
                                <span className="font-bold text-sm" style={{ color: colors.accent.primary }}>{msg.username}: </span>
                                <span className="text-sm break-words" style={{ color: colors.text.primary }}>{msg.message}</span>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* INPUT DO CHAT */}
                    <form onSubmit={sendMessage} className="p-4 border-t" style={{ backgroundColor: colors.background.tertiary, borderColor: colors.border.primary }}>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Envie uma mensagem..."
                                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                                style={{
                                    backgroundColor: colors.input.background,
                                    borderColor: colors.input.border,
                                    color: colors.text.primary,
                                    '--tw-ring-color': colors.accent.primary,
                                    '--tw-ring-offset-color': colors.input.background
                                }}
                            />
                            <button 
                                type="submit" 
                                className="text-white p-2 rounded-full transition-colors shadow-md"
                                style={{ backgroundColor: colors.accent.primary }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = colors.accent.hover}
                                onMouseLeave={(e) => e.target.style.backgroundColor = colors.accent.primary}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Live;