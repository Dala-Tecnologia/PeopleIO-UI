
const Header = () => {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Nome da aplicação */}
        <h1 className="text-xl font-bold tracking-wide">
          People IO
        </h1>

        {/* Navegação 
        <nav className="space-x-6">
          <a href="/" className="hover:text-gray-200">
            Home
          </a>
          <a href="/colaboradores" className="hover:text-gray-200">
            Colaboradores
          </a>
          <a href="/departamentos" className="hover:text-gray-200">
            Departamentos
          </a>
        </nav>

        */}

        {/* Ações (ex: perfil ou logout) 
        <div>
          <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">
            Sair
          </button>
        </div>
        */}
      </div>
    </header>
  );
};

export default Header;