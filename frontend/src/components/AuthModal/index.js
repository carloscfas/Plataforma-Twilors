import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import colors from '../../configs/colors';

const AuthModal = () => {
    const { isModalOpen, activeTab, closeModal, switchTab } = useAuth();

    // Se o modal não estiver aberto, não renderiza nada
    if (!isModalOpen) return null;

    // Função para fechar o modal ao clicar no backdrop (fundo escuro)
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    // Função para fechar ao pressionar ESC
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
            onKeyDown={handleEscapeKey}
            tabIndex={0}
        >
            <div className="rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden relative" style={{ backgroundColor: colors.background.secondary }}>
                {/* Header com Tabs e Botão de Fechar */}
                <div className="flex border-b" style={{ borderColor: colors.border.primary }}>
                    <button
                        onClick={() => switchTab('login')}
                        className="flex-1 py-4 text-center font-semibold transition-colors"
                        style={{
                            color: activeTab === 'login' ? colors.accent.primary : colors.text.secondary,
                            borderBottom: activeTab === 'login' ? `2px solid ${colors.accent.primary}` : '2px solid transparent',
                            backgroundColor: activeTab === 'login' ? colors.background.tertiary : 'transparent'
                        }}
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => switchTab('register')}
                        className="flex-1 py-4 text-center font-semibold transition-colors"
                        style={{
                            color: activeTab === 'register' ? colors.accent.primary : colors.text.secondary,
                            borderBottom: activeTab === 'register' ? `2px solid ${colors.accent.primary}` : '2px solid transparent',
                            backgroundColor: activeTab === 'register' ? colors.background.tertiary : 'transparent'
                        }}
                    >
                        Criar Conta
                    </button>
                    <button
                        onClick={closeModal}
                        className="px-4 transition-colors"
                        style={{ color: colors.text.secondary }}
                        onMouseEnter={(e) => e.target.style.color = colors.text.primary}
                        onMouseLeave={(e) => e.target.style.color = colors.text.secondary}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Conteúdo do Modal */}
                <div className="p-8">
                    {activeTab === 'login' ? (
                        <LoginForm onClose={closeModal} />
                    ) : (
                        <RegisterForm onClose={closeModal} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
