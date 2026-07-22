import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { getTopLives } from '../api';
import colors from '../configs/colors';

const LiveCarousel = () => {
    const [lives, setLives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopLives = async () => {
            try {
                const res = await getTopLives();
                setLives(res.data);
            } catch (error) {
                console.error('Erro ao buscar top lives:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopLives();
    }, []);

    const getYouTubeThumbnail = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
    };

    if (loading) {
        return (
            <div className="px-6 py-4" style={{ backgroundColor: colors.background.secondary }}>
                <div className="text-center" style={{ color: colors.text.secondary }}>
                    Carregando lives...
                </div>
            </div>
        );
    }

    if (lives.length === 0) {
        return null;
    }

    return (
        <div className="px-6 py-4" style={{ backgroundColor: colors.background.secondary }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: colors.text.primary }}>
                    Lives em Destaque
                </h2>
                {lives.length > 5 && (
                    <div className="flex gap-2">
                        <button 
                            className="swiper-button-prev-custom p-2 rounded-full transition-colors hover:opacity-80"
                            style={{ backgroundColor: colors.background.tertiary, color: colors.text.primary }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button 
                            className="swiper-button-next-custom p-2 rounded-full transition-colors hover:opacity-80"
                            style={{ backgroundColor: colors.background.tertiary, color: colors.text.primary }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={5}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                grabCursor={true}
                className="mySwiper"
            >
                {lives.map((live) => {
                    const thumbnail = getYouTubeThumbnail(live.video_url);
                    return (
                        <SwiperSlide key={live.id}>
                            <Link
                                to={`/live/${live.slug}`}
                                className="group cursor-pointer block"
                            >
                                <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                                    {thumbnail ? (
                                        <img
                                            src={thumbnail}
                                            alt={live.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.background.tertiary }}>
                                            <span className="text-sm" style={{ color: colors.text.muted }}>Sem thumbnail</span>
                                        </div>
                                    )}
                                    {live.is_live && (
                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
                                            AO VIVO
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-semibold text-sm truncate" style={{ color: colors.text.primary }}>
                                    {live.title}
                                </h3>
                                <p className="text-xs" style={{ color: colors.text.secondary }}>
                                    @{live.streamer_username}
                                </p>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default LiveCarousel;
