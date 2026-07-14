import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Regra para quando a pessoa não tiver token logado
const Navbar = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] py-4 px-8 flex justify-between items-center border-b border-gray-300">
            <Link to="/" className="text-2xl font-bold text-blue-600">Twilors</Link>
            
            <form onSubmit={handleSearch} className="relative flex-1 max-w-xl mx-8">
                <input
                    type="text"
                    placeholder="Pesquisar streams ou streamers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>
            
            <div className="flex gap-4 items-center">
                {token ? (
                    <>
                        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Explorar</Link>
                        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Criar Live</Link>
                        {user?.is_streamer && (
                            <Link 
                                to={`/streamer/${user.username}`}
                                className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1"
                            >
                                <span>👤</span>Perfil
                            </Link>
                        )}
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Sair
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Entrar</Link>
                        <Link 
                            to="/register" 
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Cadastrar
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
