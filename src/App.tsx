import './App.css'
import { useState, useEffect } from 'react';
import Header from '@/components/base/Header'
import { FormularioColaborador } from './components/form/FormularioColaborador'
import { Routes, Route, Navigate } from "react-router-dom";
import { ColaboradoresList } from './components/colaborador-list/colaborador-list';
import { Loader } from './components/ui/loader';
import { Notification } from './components/ui/Notification';
import { NotificationContext } from './components/ui/NotificationContext';
import type { NotificationData } from './components/ui/NotificationContext';

// Imports do MSAL (Azure AD)
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from './config/authConfig';
import { PortalLayout } from './pages/portal/PortalLayout';

// Inicializa a instância do MSAL fora do componente para evitar recriação
const msalInstance = new PublicClientApplication(msalConfig);

// Inicialização assíncrona necessária para MSAL v3+
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        // @ts-ignore - payload é do tipo AuthenticationResult
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);
    }
});

export default function App() {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  
  // Garante que o MSAL inicialize corretamente
  useEffect(() => {
    msalInstance.initialize().then(() => {
        // Lógica opcional pós-inicialização
    }).catch(e => console.error(e));
  }, []);

  const showNotification = (notificationData: NotificationData) => {
    setNotification(notificationData);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <MsalProvider instance={msalInstance}>
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      <div className="flex flex-col min-h-screen">
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={hideNotification} />
      )}
      
      {/* Conteúdo visível apenas quando NÃO autenticado */}
      <UnauthenticatedTemplate>
          <PortalLayout />
          {/*
          <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary">
              <h1 className="text-2xl font-bold mb-4 text-text-primary">Bem-vindo ao PeopleIO</h1>
              <button 
                  onClick={handleLogin}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                  Entrar com Azure AD
              </button>
          </div>
          */}
      </UnauthenticatedTemplate>

      {/* Conteúdo visível apenas quando autenticado */}
      <AuthenticatedTemplate>
      <Header />
      <main className="flex-grow isolate bg-bg-primary px-6 py-24 sm:py-32 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-gradient-theme opacity-20 sm:left-[calc(50%-40rem)] sm:w-288.75"
          ></div>
        </div>
      <Routes>
        <Route path="/" element={<Navigate to="/colaboradores" replace={true} />} />
        <Route path="/colaboradores" element={<ColaboradoresList/>} />
        <Route path="/colaboradores/novo" element={<FormularioColaborador />} />
        <Route path="/loader" element={<Loader />} />
      </Routes>
      </main>
      </AuthenticatedTemplate>
      
      </div>
    </NotificationContext.Provider>
    </MsalProvider>
  )
}
