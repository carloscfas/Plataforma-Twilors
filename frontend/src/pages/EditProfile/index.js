import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getUserProfile } from '../../api';
import colors from '../../configs/colors';

const EditProfile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
    });
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const res = await getUserProfile();
                setFormData({
                    first_name: res.data.first_name || '',
                    last_name: res.data.last_name || '',
                    bio: res.data.bio || '',
                });
                if (res.data.avatar) {
                    setAvatarPreview(res.data.avatar);
                }
                if (res.data.banner) {
                    setBannerPreview(res.data.banner);
                }
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError('Erro ao carregar perfil');
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBanner(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const data = new FormData();
            data.append('first_name', formData.first_name);
            data.append('last_name', formData.last_name);
            data.append('bio', formData.bio);
            
            if (avatar) {
                data.append('avatar', avatar);
            }
            if (banner) {
                data.append('banner', banner);
            }

            const res = await api.put('accounts/profile/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Atualizar dados no localStorage
            localStorage.setItem('user', JSON.stringify(res.data));
            
            setSuccess(true);
            setTimeout(() => {
                navigate(`/streamer/${user.username}`);
            }, 1500);
        } catch (err) {
            console.error('Erro ao salvar:', err);
            setError(err.response?.data?.error || 'Erro ao salvar perfil');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background.primary }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.accent.primary }}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: colors.background.primary }}>
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: colors.background.secondary }}>
                    <h1 className="text-3xl font-bold mb-8" style={{ color: colors.text.primary }}>
                        Editar Perfil
                    </h1>

                    {error && (
                        <div className="px-4 py-3 rounded mb-6" style={{ backgroundColor: `${colors.status.error}20`, borderColor: colors.status.error, color: colors.status.error }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="px-4 py-3 rounded mb-6" style={{ backgroundColor: `${colors.status.success}20`, borderColor: colors.status.success, color: colors.status.success }}>
                            Perfil atualizado com sucesso!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Banner */}
                        <div>
                            <label className="block text-sm font-bold mb-4" style={{ color: colors.text.primary }}>
                                Banner
                            </label>
                            <div className="mb-4">
                                {bannerPreview ? (
                                    <img
                                        src={bannerPreview}
                                        alt="Banner Preview"
                                        className="w-full h-40 rounded-xl object-cover border"
                                        style={{ borderColor: colors.border.primary }}
                                    />
                                ) : (
                                    <div className="w-full h-40 rounded-xl flex items-center justify-center text-sm uppercase tracking-wide" style={{ background: colors.gradient.dark, color: colors.text.muted }}>
                                        Nenhum banner definido
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleBannerChange}
                                className="block w-full text-sm"
                                style={{ color: colors.text.secondary }}
                            />
                            <p className="text-xs mt-2" style={{ color: colors.text.muted }}>
                                Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                            </p>
                        </div>

                        {/* Avatar */}
                        <div>
                            <label className="block text-sm font-bold mb-4" style={{ color: colors.text.primary }}>
                                Avatar
                            </label>
                            <div className="flex items-center gap-6">
                                <div className="flex-shrink-0">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar Preview"
                                            className="w-24 h-24 rounded-full object-cover border-4"
                                            style={{ borderColor: colors.accent.primary }}
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold" style={{ background: colors.gradient.primary, color: colors.text.primary }}>
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="block w-full text-sm"
                                        style={{ color: colors.text.secondary }}
                                    />
                                    <p className="text-xs mt-2" style={{ color: colors.text.muted }}>
                                        Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-bold mb-2" style={{ color: colors.text.primary }}>
                                Primeiro Nome
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Seu primeiro nome"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                                style={{
                                    backgroundColor: colors.input.background,
                                    borderColor: colors.input.border,
                                    color: colors.text.primary,
                                    '--tw-ring-color': colors.accent.primary,
                                    '--tw-ring-offset-color': colors.input.background
                                }}
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-bold mb-2" style={{ color: colors.text.primary }}>
                                Sobrenome
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Seu sobrenome"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                                style={{
                                    backgroundColor: colors.input.background,
                                    borderColor: colors.input.border,
                                    color: colors.text.primary,
                                    '--tw-ring-color': colors.accent.primary,
                                    '--tw-ring-offset-color': colors.input.background
                                }}
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-bold mb-2" style={{ color: colors.text.primary }}>
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Conte um pouco sobre você..."
                                maxLength="500"
                                rows="6"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-all"
                                style={{
                                    backgroundColor: colors.input.background,
                                    borderColor: colors.input.border,
                                    color: colors.text.primary,
                                    '--tw-ring-color': colors.accent.primary,
                                    '--tw-ring-offset-color': colors.input.background
                                }}
                            />
                            <p className="text-xs mt-2" style={{ color: colors.text.muted }}>
                                {formData.bio.length}/500 caracteres
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate(`/streamer/${user.username}`)}
                                className="flex-1 px-6 py-2 border rounded-lg transition"
                                style={{
                                    borderColor: colors.border.primary,
                                    color: colors.text.primary
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.card.hover}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-6 py-2 text-white rounded-lg transition disabled:opacity-50"
                                style={{
                                    backgroundColor: colors.accent.primary
                                }}
                                onMouseEnter={(e) => !saving && (e.target.style.backgroundColor = colors.accent.hover)}
                                onMouseLeave={(e) => !saving && (e.target.style.backgroundColor = colors.accent.primary)}
                            >
                                {saving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
