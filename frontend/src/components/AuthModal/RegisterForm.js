import React, { useState } from 'react';
import api from '../../api';
import colors from '../../configs/colors';

const RegisterForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        is_streamer: false
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('accounts/register/', formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setError('Erro ao realizar cadastro. Verifique os dados.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.text.primary }}>Criar Conta</h2>

            {success && (
                <div className="mb-4 p-3 rounded-lg text-center" style={{ backgroundColor: `${colors.status.success}20`, color: colors.status.success }}>
                    Cadastro realizado com sucesso! Redirecionando...
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

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" style={{ color: colors.text.primary }}>E-mail</label>
                <input
                    name="email"
                    type="email"
                    placeholder="Seu e-mail"
                    className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                        backgroundColor: colors.input.background,
                        borderColor: colors.input.border,
                        color: colors.text.primary,
                        '--tw-ring-color': colors.accent.primary,
                        '--tw-ring-offset-color': colors.input.background
                    }}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-4">
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

            <div className="flex items-center mb-6">
                <input
                    id="is_streamer_checkbox"
                    name="is_streamer"
                    type="checkbox"
                    className="mr-2 h-4 w-4 rounded focus:ring-2 transition-all"
                    style={{
                        accentColor: colors.accent.primary,
                        borderColor: colors.input.border,
                        '--tw-ring-color': colors.accent.primary
                    }}
                    onChange={handleChange}
                />
                <label htmlFor="is_streamer_checkbox" className="text-sm cursor-pointer select-none" style={{ color: colors.text.primary }}>
                    Quero ser um Streamer
                </label>
            </div>

            <button type="submit" className="w-full text-white p-3 rounded-lg transition duration-200 font-semibold text-lg shadow-md hover:shadow-lg"
                style={{
                    background: colors.gradient.primary,
                    boxShadow: `0 4px 14px ${colors.accent.primary}40`
                }}
                onMouseEnter={(e) => e.target.style.background = colors.gradient.secondary}
                onMouseLeave={(e) => e.target.style.background = colors.gradient.primary}
            >
                Cadastrar
            </button>
        </form>
    );
};

export default RegisterForm;
