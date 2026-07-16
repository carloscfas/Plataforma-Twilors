import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/navbar";
import Live from "./pages/Live";
import StreamerProfile from "./pages/StreamerProfile";
import EditProfile from "./pages/EditProfile";
import Search from "./pages/Search";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-bg-primary">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/live/:slug" element={<Live />} />
                    <Route path="/streamer/:username" element={<StreamerProfile />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/search" element={<Search />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
