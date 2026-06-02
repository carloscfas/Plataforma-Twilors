import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/navbar";
import Live from "./pages/Live";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/live/:slug" element={<Live />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
