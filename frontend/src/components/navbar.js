import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Regra para quando a pessoa não tiver token logado
const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">Twilors</Link>
            
            <div className="flex gap-4 items-center">
                {token ? (
                    <>
                        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Explorar</Link>
                        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Criar Live</Link>
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
