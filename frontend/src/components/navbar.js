import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Regra para quando a pessoa não tiver token logado
const Navbar = () => {
    const navigate = useNavigate();
    const { openLoginModal, openRegisterModal } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="bg-bg-secondary border-b border-border-primary py-3 px-6 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <Link to="/" className="text-2xl font-bold text-accent-primary hover:text-accent-hover transition-colors">Twilors</Link>
            </div>
            
            <form onSubmit={handleSearch} className="relative flex-1 max-w-xl mx-8">
                <input
                    type="text"
                    placeholder="Pesquisar streams ou streamers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 bg-input-bg border border-input-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent text-text-primary placeholder-input-placeholder transition-all"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-accent-primary transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>
            
            <div className="flex gap-4 items-center">
                {token ? (
                    <>
                        <Link to="/" className="text-text-secondary hover:text-accent-primary font-medium transition-colors">Explorar</Link>
                        <Link to="/dashboard" className="text-text-secondary hover:text-accent-primary font-medium transition-colors">Criar Live</Link>
                        {user?.is_streamer && (
                            <Link 
                                to={`/streamer/${user.username}`}
                                className="text-text-secondary hover:text-accent-primary font-medium flex items-center gap-1 transition-colors"
                            >
                                <span>👤</span>Perfil
                            </Link>
                        )}
                        <button 
                            onClick={handleLogout}
                            className="bg-status-error text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                            Sair
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={openLoginModal}
                            className="text-text-secondary hover:text-accent-primary font-medium transition-colors"
                        >
                            Entrar
                        </button>
                        <button 
                            onClick={openRegisterModal}
                            className="bg-accent-primary text-white px-4 py-2 rounded hover:bg-accent-hover transition-colors font-medium"
                        >
                            Cadastrar
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
