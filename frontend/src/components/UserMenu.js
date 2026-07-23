import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import colors from '../configs/colors';

const UserMenu = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent-primary hover:border-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent-primary text-white font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-bg-tertiary border border-border-primary rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-border-primary">
                        <p className="font-semibold text-text-primary">{user?.username}</p>
                        <p className="text-sm text-text-secondary truncate">{user?.email}</p>
                    </div>

                    <Link
                        to={`/streamer/${user?.username}`}
                        className="block px-4 py-2 text-text-secondary hover:bg-bg-secondary hover:text-accent-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Meu Perfil
                    </Link>

                    <Link
                        to="/edit-profile"
                        className="block px-4 py-2 text-text-secondary hover:bg-bg-secondary hover:text-accent-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Editar Perfil
                    </Link>

                    <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-text-secondary hover:bg-bg-secondary hover:text-accent-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Criar Live
                    </Link>

                    <Link
                        to="#"
                        className="block px-4 py-2 text-text-secondary hover:bg-bg-secondary hover:text-accent-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Idioma
                    </Link>

                    <Link
                        to="#"
                        className="block px-4 py-2 text-text-secondary hover:bg-bg-secondary hover:text-accent-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Tema Escuro
                    </Link>

                    <div className="border-t border-border-primary mt-2 pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-status-error hover:bg-bg-secondary transition-colors"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
