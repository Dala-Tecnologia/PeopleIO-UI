// ...existing code...
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";

const Header = () => {
  const { instance } = useMsal();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // restore preference or use system preference
    try {
      const stored = localStorage.getItem("pio-theme");
      if (stored) {
        const dark = stored === "dark";
        document.documentElement.classList.toggle("dark", dark);
        setIsDark(dark);
        return;
      }
    } catch {
      /* ignore localStorage errors */
    }

    const systemPrefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    document.documentElement.classList.toggle("dark", systemPrefersDark);
    setIsDark(systemPrefersDark);
  }, []);

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  const toggleDarkMode = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
    try {
      localStorage.setItem("pio-theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  return (
    <header className="bg-purple-900 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold tracking-wide hover:opacity-80 transition"
        >
          People IO
        </Link>

        <nav className="flex-grow flex items-center justify-center space-x-6">
          <Link
            to="/colaboradores"
            className="hover:text-indigo-400 transition"
          >
            Colaboradores
          </Link>
          <Link
            to="/colaboradores/novo"
            className="hover:text-indigo-400 transition"
          >
            Novo
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="px-3 py-2 rounded-md bg-tranparent hover:bg-gray-900 transition flex items-center gap-2 cursor-pointer"
            aria-pressed={isDark}
            aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
            title={isDark ? "Tema: escuro (clique para claro)" : "Tema: claro (clique para escuro)"}
          >
            {/* mostra sol quando estiver em dark, e lua quando estiver em claro */}
            <span className="text-lg">{isDark ?
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
              </svg> //https://heroicons.com/solid
              :
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
              </svg> //https://heroicons.com/solid
            }</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md bg-tranparent hover:bg-gray-900 transition flex items-center gap-2 cursor-pointer"
            aria-label="Fazer logoff"
            title="Fazer logoff"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;