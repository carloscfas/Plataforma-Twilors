import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getUserProfile } from '../../api';

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Editar Perfil
                    </h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                            Perfil atualizado com sucesso!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Banner */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-4">
                                Banner
                            </label>
                            <div className="mb-4">
                                {bannerPreview ? (
                                    <img
                                        src={bannerPreview}
                                        alt="Banner Preview"
                                        className="w-full h-40 rounded-xl object-cover border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-full h-40 rounded-xl bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 flex items-center justify-center text-gray-500 text-sm uppercase tracking-wide">
                                        Nenhum banner definido
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleBannerChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                            </p>
                        </div>

                        {/* Avatar */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-4">
                                Avatar
                            </label>
                            <div className="flex items-center gap-6">
                                <div className="flex-shrink-0">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar Preview"
                                            className="w-24 h-24 rounded-full object-cover border-4 border-purple-500"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Primeiro Nome
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Seu primeiro nome"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Sobrenome
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Seu sobrenome"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Conte um pouco sobre você..."
                                maxLength="500"
                                rows="6"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                {formData.bio.length}/500 caracteres
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate(`/streamer/${user.username}`)}
                                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
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
