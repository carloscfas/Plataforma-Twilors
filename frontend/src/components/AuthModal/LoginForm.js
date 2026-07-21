import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getUserProfile } from '../../api';
import SocialLoginButtons from '../SocialLoginButtons';
import socialAuthService from '../../services/socialAuthService';
import colors from '../../configs/colors';
import toast from 'react-hot-toast';

const LoginForm = ({ onClose }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('token/', formData);
            
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            const userRes = await getUserProfile();
            localStorage.setItem('user', JSON.stringify(userRes.data));

            setSuccess(true);
            setTimeout(() => {
                onClose();
                navigate('/');
            }, 1000);
        } catch (error) {
            setError('Usuário ou senha incorretos.');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await socialAuthService.initiateGoogleLogin();
        } catch (error) {
            toast.error('Erro ao iniciar login com Google');
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await socialAuthService.initiateFacebookLogin();
        } catch (error) {
            toast.error('Erro ao iniciar login com Facebook');
        }
    };

    const handleAppleLogin = async () => {
        try {
            await socialAuthService.initiateAppleLogin();
        } catch (error) {
            toast.error('Erro ao iniciar login com Apple');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold mb-6 text-center font-sans" style={{ color: colors.text.primary }}>Entrar na Plataforma</h2>

            {success && (
                <div className="mb-4 p-3 rounded-lg text-center" style={{ backgroundColor: `${colors.status.success}20`, color: colors.status.success }}>
                    Login realizado com sucesso!
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 rounded-lg text-center" style={{ backgroundColor: `${colors.status.error}20`, color: colors.status.error }}>
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" style={{ color: colors.text.primary }}>Usuário</label>
                <input
                    name="username"
                    placeholder="Seu usuário"
                    className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                        backgroundColor: colors.input.background,
                        borderColor: colors.input.border,
                        color: colors.text.primary,
                        '--tw-ring-color': colors.accent.primary,
                        '--tw-ring-offset-color': colors.input.background
                    }}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-bold mb-2" style={{ color: colors.text.primary }}>Senha</label>
                <input
                    name="password"
                    type="password"
                    placeholder="Sua senha"
                    className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                        backgroundColor: colors.input.background,
                        borderColor: colors.input.border,
                        color: colors.text.primary,
                        '--tw-ring-color': colors.accent.primary,
                        '--tw-ring-offset-color': colors.input.background
                    }}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit" className="w-full text-white p-3 rounded-lg transition duration-200 font-semibold text-lg shadow-md hover:shadow-lg"
                style={{
                    background: colors.gradient.primary,
                    boxShadow: `0 4px 14px ${colors.accent.primary}40`
                }}
                onMouseEnter={(e) => e.target.style.background = colors.gradient.secondary}
                onMouseLeave={(e) => e.target.style.background = colors.gradient.primary}
            >
                Entrar
            </button>

            <div className="my-6 flex items-center">
                <div className="flex-grow border-t" style={{ borderColor: colors.border.primary }}></div>
                <span className="px-3 text-sm" style={{ color: colors.text.secondary }}>Ou continue com</span>
                <div className="flex-grow border-t" style={{ borderColor: colors.border.primary }}></div>
            </div>

            <SocialLoginButtons
                onGoogleClick={handleGoogleLogin}
                onFacebookClick={handleFacebookLogin}
                onAppleClick={handleAppleLogin}
            />
        </form>
    );
};

export default LoginForm;
