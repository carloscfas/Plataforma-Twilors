import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";

// Por enquanto, como não criamos as páginas,
// vamos criar componentes temporários só para o app não quebrar.
const Login = () => <h2>Página de Login</h2>
const Home = () => <h2>Home - Lista de Streams</h2>

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
        );
        }

        export default App;