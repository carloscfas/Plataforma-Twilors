import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import api from '../../api';
import colors from '../../configs/colors';
import toast from 'react-hot-toast';
import Hls from 'hls.js';

const Live = () => {
    const { slug } = useParams();
    const [stream, setStream] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isStreamer, setIsStreamer] = useState(false);

    // Estados do Chat
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);
    const videoRef = useRef(null);
    const hlsRef = useRef(null);

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
                    
                    // Verificar se usuário atual é o streamer
                    try {
                        const userProfile = await api.get('accounts/profile/');
                        setIsStreamer(userProfile.data.id === response.data.streamer);
                    } catch (error) {
                        setIsStreamer(false);
                    }
                }
            } catch (error) {
                toast.error("Erro ao buscar live");
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
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
        };
    }, [slug]);

    // Configurar HLS player quando stream for carregado
    useEffect(() => {
        if (stream && stream.stream_type === 'rtmp' && videoRef.current) {
            const hlsUrl = `http://localhost:8080/hls/${stream.rtmp_key}.m3u8`;
            
            if (Hls.isSupported()) {
                if (hlsRef.current) {
                    hlsRef.current.destroy();
                }
                
                const hls = new Hls();
                hls.loadSource(hlsUrl);
                hls.attachMedia(videoRef.current);
                
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoRef.current.play().catch(console.error);
                });
                
                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                hls.recoverMediaError();
                                break;
                            default:
                                hls.destroy();
                                break;
                        }
                    }
                });
                
                hlsRef.current = hls;
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = hlsUrl;
                videoRef.current.addEventListener('loadedmetadata', () => {
                    videoRef.current.play().catch(console.error);
                });
            }
        }
    }, [stream]);

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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* LADO ESQUERDO: PLAYER E INFO */}
                <div className="flex-1">
                    <div className="bg-black aspect-video w-full rounded-lg shadow-2xl overflow-hidden relative">
                        {/* Player HLS */}
                        <video
                            ref={videoRef}
                            controls
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                        />

                        {/* Mensagem quando stream não está ao vivo */}
                        {!stream.is_live && (
                            <div className="flex items-center justify-center h-full text-white absolute inset-0 bg-black bg-opacity-75">
                                <div className="text-center">
                                    <p className="text-xl mb-2">Stream offline</p>
                                    <p className="text-sm text-gray-400">Aguardando streamer iniciar transmissão via OBS/Streamlabs</p>
                                </div>
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
                        
                        {/* Informações RTMP para streamer */}
                        {isStreamer && stream.stream_type === 'rtmp' && (
                            <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: colors.background.tertiary }}>
                                <h3 className="font-bold mb-2" style={{ color: colors.text.primary }}>Configurações OBS/Streamlabs</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-semibold" style={{ color: colors.text.secondary }}>Server:</span>
                                        <code className="ml-2 p-1 rounded" style={{ backgroundColor: colors.input.background }}>rtmp://localhost:1935/live</code>
                                    </div>
                                    <div>
                                        <span className="font-semibold" style={{ color: colors.text.secondary }}>Stream Key:</span>
                                        <code className="ml-2 p-1 rounded" style={{ backgroundColor: colors.input.background }}>{stream.rtmp_key}</code>
                                    </div>
                                </div>
                            </div>
                        )}
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