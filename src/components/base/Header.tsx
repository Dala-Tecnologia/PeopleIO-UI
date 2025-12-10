// ...existing code...
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
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
    <header className="bg-gray-900 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold tracking-wide hover:opacity-80 transition"
        >
          People IO
        </Link>

        <nav className="flex space-x-6">
          <Link
            to="/colaboradores"
            className="hover:text-indigo-400 transition"
          >
            Colaboradores
          </Link>
          <Link
            to="/colaboradores/new"
            className="hover:text-indigo-400 transition"
          >
            Novo
          </Link>
        </nav>

        <button
          onClick={toggleDarkMode}
          className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition flex items-center gap-2 cursor-pointer"
          aria-pressed={isDark}
          aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
          title={isDark ? "Tema: escuro (clique para claro)" : "Tema: claro (clique para escuro)"}
        >
          {/* mostra sol quando estiver em dark, e lua quando estiver em claro */}
          <span className="text-lg">{isDark ? "☀️" : "🌙"}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;