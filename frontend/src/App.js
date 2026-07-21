import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/navbar";
import Live from "./pages/Live";
import StreamerProfile from "./pages/StreamerProfile";
import EditProfile from "./pages/EditProfile";
import Search from "./pages/Search";
import AuthModal from "./components/AuthModal";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="min-h-screen bg-bg-primary">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />}/>
                        <Route path="/dashboard" element={<Dashboard/>} />
                        <Route path="/live/:slug" element={<Live />} />
                        <Route path="/streamer/:username" element={<StreamerProfile />} />
                        <Route path="/edit-profile" element={<EditProfile />} />
                        <Route path="/search" element={<Search />} />
                    </Routes>
                    <AuthModal />
                    <Toaster position="top-right" reverseOrder={false} />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
