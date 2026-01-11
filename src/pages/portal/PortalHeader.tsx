import { Link } from "react-router-dom";
import { useState } from "react";
import peopleIoLogo from '@/assets/svg/peopleio-logo.svg';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../config/authConfig";

export const PortalHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch((e) => {
            console.error(e);
        });
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-30 w-full border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-900 hover:text-green-500">
                    <img src={peopleIoLogo} alt="PeopleIO Logo" className="h-8 w-auto" />
                    PeopleIO
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/paraPessoas" className="text-gray-700 hover:text-green-500">
                        Para pessoas
                    </Link>
                    <Link to="/paraEmpresas" className="text-gray-700 hover:text-green-500">
                        Para empresas
                    </Link>
                </nav>
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={handleLogin}
                        className="text-blue-900 font-medium hover:underline hover:text-green-500"
                    >
                        Entrar
                    </button>

                    <Link
                        to="/register"
                        className="rounded-md bg-blue-900 px-4 py-2 text-white hover:bg-green-500 transition"
                    >
                        Cadastrar-se
                    </Link>
                </div>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-gray-700"
                >
                    ☰
                </button>
            </div>
            {menuOpen && (
                <div className="md:hidden border-t bg-white px-6 py-4 space-y-4">
                    <Link to="/paraPessoas" className="block text-gray-700">
                        Para pessoas
                    </Link>
                    <Link to="/paraEmpresas" className="block text-gray-700">
                        Para empresas
                    </Link>

                    <div className="pt-4 border-t flex flex-col gap-3">
                        <button
                            onClick={handleLogin}
                            className="text-blue-600 font-medium"
                        >
                            Entrar
                        </button>
                        <Link
                            to="/register"
                            className="rounded-md bg-blue-600 px-4 py-2 text-center text-white"
                        >
                            Cadastrar-se
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}