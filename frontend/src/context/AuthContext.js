import React, { createContext, useContext, useState } from 'react';

// Criamos o Contexto para autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto facilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

// Provider que vai envolver a aplicação
export const AuthProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('login'); // 'login' ou 'register'

    // Função para abrir o modal na tab de login
    const openLoginModal = () => {
        setActiveTab('login');
        setIsModalOpen(true);
    };

    // Função para abrir o modal na tab de registro
    const openRegisterModal = () => {
        setActiveTab('register');
        setIsModalOpen(true);
    };

    // Função para fechar o modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Função para alternar entre as tabs
    const switchTab = (tab) => {
        setActiveTab(tab);
    };

    const value = {
        isModalOpen,
        activeTab,
        openLoginModal,
        openRegisterModal,
        closeModal,
        switchTab
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
