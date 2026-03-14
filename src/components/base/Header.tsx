// ...existing code...
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useMsal } from "@azure/msal-react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const Header = () => {
  const PROFILE_STORAGE_KEY = "pio-user-profile";
  const { instance, accounts } = useMsal();
  const [isDark, setIsDark] = useState<boolean>(false);
  const [language, setLanguage] = useState<"pt" | "en">("pt");
  const [isTranslatorReady, setIsTranslatorReady] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [profileSettings, setProfileSettings] = useState({
    displayName: "",
    loginName: "",
    photoUrl: "",
    profileData: "",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeAccount = accounts[0];
  const accountUserName = activeAccount?.name || "Usuario";
  const accountLoginName = activeAccount?.username || "usuario@peopleio.com";
  const claimMap = (activeAccount?.idTokenClaims ?? {}) as Record<string, unknown>;
  const accountPhoto = typeof claimMap.picture === "string" ? claimMap.picture : null;

  const effectiveUserName = profileSettings.displayName.trim() || accountUserName;
  const effectiveUserPhoto = profileSettings.photoUrl.trim() || accountPhoto;
  const userInitials = effectiveUserName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("") || "U";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as typeof profileSettings;
        setProfileSettings({
          displayName: parsed.displayName || "",
          loginName: parsed.loginName || "",
          photoUrl: parsed.photoUrl || "",
          profileData: parsed.profileData || "",
        });
        return;
      }
    } catch {
      /* ignore local storage parse errors */
    }

    setProfileSettings((current) => ({
      ...current,
      displayName: current.displayName || accountUserName,
      loginName: current.loginName || accountLoginName,
      photoUrl: current.photoUrl || accountPhoto || "",
    }));
  }, [accountLoginName, accountPhoto, accountUserName]);

  const openSettings = () => {
    setSaveMessage(null);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
    setSaveMessage(null);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileSettings));
      setSaveMessage("Configuracoes salvas com sucesso.");
    } catch {
      setSaveMessage("Nao foi possivel salvar agora.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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

  const applyGoogleLanguage = (nextLanguage: "pt" | "en") => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (!combo) return;

    combo.value = nextLanguage;
    combo.dispatchEvent(new Event("change"));
  };

  const changeLanguage = (nextLanguage: "pt" | "en") => {
    setLanguage(nextLanguage);
  };

  useEffect(() => {
    try {
      const storedLanguage = localStorage.getItem("pio-language");
      if (storedLanguage === "pt" || storedLanguage === "en") {
        setLanguage(storedLanguage);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeTranslator = () => {
      if (!window.google?.translate?.TranslateElement) return;

      const translatorContainer = document.getElementById("google_translate_element");
      if (!translatorContainer) return;
      translatorContainer.innerHTML = "";

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "pt",
          includedLanguages: "pt,en",
          autoDisplay: false,
        },
        "google_translate_element"
      );

      // Aguarda o select interno do Google Translate para habilitar o controle.
      const interval = window.setInterval(() => {
        const combo = document.querySelector(".goog-te-combo");
        if (!combo) return;
        window.clearInterval(interval);
        setIsTranslatorReady(true);
      }, 200);

      window.setTimeout(() => {
        window.clearInterval(interval);
      }, 5000);
    };

    window.googleTranslateElementInit = initializeTranslator;

    const existingScript = document.getElementById("google-translate-script") as HTMLScriptElement | null;
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      initializeTranslator();
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("pio-language", language);
    } catch {
      /* ignore */
    }

    if (!isTranslatorReady) return;
    applyGoogleLanguage(language);
  }, [isTranslatorReady, language]);

  return (
    <header className="bg-blue-950 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-wide hover:opacity-80 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.625a.75.75 0 0 1 0 1.32L12.356 14.16a.75.75 0 0 1-.712 0L1.894 8.535a.75.75 0 0 1 0-1.32l9.75-5.625Z" />
            <path d="m1.894 9.479.924.532a.75.75 0 0 1 .406.661V15a2.25 2.25 0 0 0 1.125 1.948l7.5 4.321a.75.75 0 0 0 .75 0l7.5-4.321A2.25 2.25 0 0 0 20.25 15v-4.328a.75.75 0 0 1 .406-.661l.924-.532a.75.75 0 0 1 1.12.663V15A3.75 3.75 0 0 1 18.75 18.75h-13.5A3.75 3.75 0 0 1 .75 15V10.142a.75.75 0 0 1 1.144-.663Z" />
          </svg>
          People IO
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden px-3 py-2 rounded-md hover:bg-gray-900 transition flex items-center gap-2"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-grow items-center justify-center">
          <div className="flex items-center space-x-1">
            <Link
              to="/candidatos"
              className="px-4 py-2 rounded-md hover:bg-gray-900 transition flex items-center gap-2 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.348A7.698 7.698 0 0 1 12 15a7.698 7.698 0 0 1 5.855 2.749A8.217 8.217 0 0 1 20.25 12c0-4.56-3.69-8.25-8.25-8.25s-8.25 3.69-8.25 8.25c0 2.234.847 4.274 2.235 5.852Z" clipRule="evenodd" />
              </svg>
              Candidatos
            </Link>
            <Link
              to="/candidato/novo"
              className="px-4 py-2 rounded-md hover:bg-gray-900 transition flex items-center gap-2 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v9.75h9.75a.75.75 0 0 1 0 1.5H12.75V21a.75.75 0 0 1-1.5 0V12.75H2.25a.75.75 0 0 1 0-1.5H11.25V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
              </svg>
              Novo Candidato
            </Link>
            <Link
              to="/candidato/feed"
              className="px-4 py-2 rounded-md hover:bg-gray-900 transition flex items-center gap-2 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v8.25a2.25 2.25 0 0 1-2.25 2.25H9.53a.75.75 0 0 0-.53.22l-2.47 2.47A.75.75 0 0 1 5.25 17.94V15.75A2.25 2.25 0 0 1 3 13.5V5.25Zm4.5 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 9Zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 7.5 12Z" clipRule="evenodd" />
              </svg>
              Feed
            </Link>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-2 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M11.25 4.5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-1.272a13.864 13.864 0 0 1-2.17 5.686c.796.792 1.714 1.49 2.752 2.078a.75.75 0 0 1-.74 1.304 13.29 13.29 0 0 1-3.005-2.288 13.315 13.315 0 0 1-3.005 2.288.75.75 0 1 1-.74-1.304 11.8 11.8 0 0 0 2.75-2.078 12.364 12.364 0 0 1-1.899-3.681.75.75 0 0 1 1.446-.397c.385 1.4 1.037 2.61 1.94 3.609a12.358 12.358 0 0 0 1.641-4.969H12a.75.75 0 0 1-.75-.75ZM5.58 6.75a.75.75 0 0 1 .712.515l4.5 13.5a.75.75 0 1 1-1.423.474L8.31 18H3.69l-1.06 3.239a.75.75 0 1 1-1.423-.474l4.5-13.5a.75.75 0 0 1 .712-.515Zm-.36 9.75h2.56L6.5 12.66 5.22 16.5Z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide text-white/85">Idioma</span>
            <div className="flex items-center rounded-md bg-white/10 p-0.5">
              <button
                type="button"
                onClick={() => changeLanguage("pt")}
                className={`rounded px-2 py-1 text-xs font-semibold transition ${language === "pt" ? "bg-white text-blue-950" : "text-white/80 hover:bg-white/15"}`}
                aria-pressed={language === "pt"}
                disabled={!isTranslatorReady}
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => changeLanguage("en")}
                className={`rounded px-2 py-1 text-xs font-semibold transition ${language === "en" ? "bg-white text-blue-950" : "text-white/80 hover:bg-white/15"}`}
                aria-pressed={language === "en"}
                disabled={!isTranslatorReady}
              >
                EN
              </button>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-3 py-2 rounded-md bg-transparent hover:bg-gray-900 transition flex items-center gap-2 cursor-pointer"
            aria-pressed={isDark}
            aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
            title={isDark ? "Tema: escuro (clique para claro)" : "Tema: claro (clique para escuro)"}
          >
            {/* mostra sol quando estiver em dark, e lua quando estiver em claro */}
            <span className="text-lg">{isDark ?
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
              </svg> 
              :
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
              </svg> 
            }</span>
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-3 py-2 rounded-md bg-transparent hover:bg-gray-900 transition flex items-center gap-2 cursor-pointer"
            >
              {effectiveUserPhoto ? (
                <img
                  src={effectiveUserPhoto}
                  alt={`Foto de ${effectiveUserName}`}
                  className="h-8 w-8 rounded-full border border-white/35 object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                  {userInitials}
                </span>
              )}
              {effectiveUserName}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-black ">
                <button
                  onClick={openSettings}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                >
                  Configuracoes
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                    <path fillRule="evenodd" d="M11.28 2.284a.75.75 0 0 1 1.44 0l.172.516a1.5 1.5 0 0 0 2.123.89l.489-.244a.75.75 0 0 1 .964.28l.72 1.246a.75.75 0 0 1-.181.96l-.41.328a1.5 1.5 0 0 0 0 2.34l.41.328a.75.75 0 0 1 .18.96l-.719 1.246a.75.75 0 0 1-.964.28l-.489-.244a1.5 1.5 0 0 0-2.123.89l-.172.516a.75.75 0 0 1-1.44 0l-.172-.516a1.5 1.5 0 0 0-2.123-.89l-.489.244a.75.75 0 0 1-.964-.28l-.72-1.246a.75.75 0 0 1 .181-.96l.41-.328a1.5 1.5 0 0 0 0-2.34l-.41-.328a.75.75 0 0 1-.18-.96l.719-1.246a.75.75 0 0 1 .964-.28l.489.244a1.5 1.5 0 0 0 2.123-.89l.172-.516ZM12 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                >
                  Logoff
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-blue-900 border-b border-blue-800 shadow-lg">
            <nav className="px-6 py-4 space-y-2">
              <Link
                to="/candidatos"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-md hover:bg-gray-900 transition flex items-center gap-2 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.348A7.698 7.698 0 0 1 12 15a7.698 7.698 0 0 1 5.855 2.749A8.217 8.217 0 0 1 20.25 12c0-4.56-3.69-8.25-8.25-8.25s-8.25 3.69-8.25 8.25c0 2.234.847 4.274 2.235 5.852Z" clipRule="evenodd" />
                </svg>
                Candidatos
              </Link>
              <Link
                to="/candidato/novo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-md hover:bg-gray-900 transition flex items-center gap-2 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v9.75h9.75a.75.75 0 0 1 0 1.5H12.75V21a.75.75 0 0 1-1.5 0V12.75H2.25a.75.75 0 0 1 0-1.5H11.25V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
                Novo Candidato
              </Link>
              <Link
                to="/candidato/feed"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-md hover:bg-gray-900 transition flex items-center gap-2 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v8.25a2.25 2.25 0 0 1-2.25 2.25H9.53a.75.75 0 0 0-.53.22l-2.47 2.47A.75.75 0 0 1 5.25 17.94V15.75A2.25 2.25 0 0 1 3 13.5V5.25Zm4.5 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 9Zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 7.5 12Z" clipRule="evenodd" />
                </svg>
                Feed
              </Link>
              <button
                onClick={() => {
                  openSettings();
                }}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-900 transition flex items-center gap-2 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M11.28 2.284a.75.75 0 0 1 1.44 0l.172.516a1.5 1.5 0 0 0 2.123.89l.489-.244a.75.75 0 0 1 .964.28l.72 1.246a.75.75 0 0 1-.181.96l-.41.328a1.5 1.5 0 0 0 0 2.34l.41.328a.75.75 0 0 1 .18.96l-.719 1.246a.75.75 0 0 1-.964.28l-.489-.244a1.5 1.5 0 0 0-2.123.89l-.172.516a.75.75 0 0 1-1.44 0l-.172-.516a1.5 1.5 0 0 0-2.123-.89l-.489.244a.75.75 0 0 1-.964-.28l-.72-1.246a.75.75 0 0 1 .181-.96l.41-.328a1.5 1.5 0 0 0 0-2.34l-.41-.328a.75.75 0 0 1-.18-.96l.719-1.246a.75.75 0 0 1 .964-.28l.489.244a1.5 1.5 0 0 0 2.123-.89l.172-.516ZM12 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
                </svg>
                Configuracoes da conta
              </button>
              <button
                onClick={() => {
                  changeLanguage(language === "pt" ? "en" : "pt");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-900 transition flex items-center gap-2 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M11.25 4.5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-1.272a13.864 13.864 0 0 1-2.17 5.686c.796.792 1.714 1.49 2.752 2.078a.75.75 0 0 1-.74 1.304 13.29 13.29 0 0 1-3.005-2.288 13.315 13.315 0 0 1-3.005 2.288.75.75 0 1 1-.74-1.304 11.8 11.8 0 0 0 2.75-2.078 12.364 12.364 0 0 1-1.899-3.681.75.75 0 0 1 1.446-.397c.385 1.4 1.037 2.61 1.94 3.609a12.358 12.358 0 0 0 1.641-4.969H12a.75.75 0 0 1-.75-.75ZM5.58 6.75a.75.75 0 0 1 .712.515l4.5 13.5a.75.75 0 1 1-1.423.474L8.31 18H3.69l-1.06 3.239a.75.75 0 1 1-1.423-.474l4.5-13.5a.75.75 0 0 1 .712-.515Zm-.36 9.75h2.56L6.5 12.66 5.22 16.5Z" />
                </svg>
                {language === "pt" ? "Idioma: Portugues (trocar para Ingles)" : "Idioma: English (switch to Portuguese)"}
              </button>
              <button
                onClick={() => {
                  toggleDarkMode();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-900 transition flex items-center gap-2 text-sm font-medium"
              >
                {isDark ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
                    </svg>
                    Tema Claro
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
                    </svg>
                    Tema Escuro
                  </>
                )}
              </button>
            </nav>
            <div className="border-t border-blue-800 px-6 py-2">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-900 rounded-md transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
                Logoff
              </button>
            </div>
          </div>
        )}
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 text-gray-900 shadow-xl dark:bg-gray-900 dark:text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Configuracoes do usuario</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Altere nome de usuario, login, foto e dados gerais.</p>
              </div>
              <button
                type="button"
                onClick={closeSettings}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                Fechar
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Nome de usuario</span>
                <input
                  type="text"
                  value={profileSettings.displayName}
                  onChange={(event) => setProfileSettings((current) => ({ ...current, displayName: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-gray-600 dark:bg-gray-800"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-medium">Nome de login</span>
                <input
                  type="text"
                  value={profileSettings.loginName}
                  onChange={(event) => setProfileSettings((current) => ({ ...current, loginName: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-gray-600 dark:bg-gray-800"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-medium">Foto (URL)</span>
                <input
                  type="url"
                  value={profileSettings.photoUrl}
                  onChange={(event) => setProfileSettings((current) => ({ ...current, photoUrl: event.target.value }))}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-gray-600 dark:bg-gray-800"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-medium">Dados gerais</span>
                <textarea
                  value={profileSettings.profileData}
                  onChange={(event) => setProfileSettings((current) => ({ ...current, profileData: event.target.value }))}
                  rows={3}
                  placeholder="Telefone, area de atuacao, cidade, portfolio..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-gray-600 dark:bg-gray-800"
                />
              </label>
            </div>

            {saveMessage && <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-300">{saveMessage}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeSettings}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveSettings}
                className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Salvar alteracoes
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">No momento, os dados sao salvos localmente no navegador. Proximo passo: salvar via API.</p>
          </div>
        </div>
      )}

      <div id="google_translate_element" className="hidden" aria-hidden="true" />
    </header>
  );
};

export default Header;