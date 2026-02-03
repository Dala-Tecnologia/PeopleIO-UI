import './App.css'
import { useState, useEffect } from 'react';
import Header from '@/components/base/Header'
import { FormularioCandidato } from './components/form/FormularioCandidatos'
import { Routes, Route, Navigate } from "react-router-dom";
import { CandidatoesList } from './components/candidato-list/candidato-list';
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
      <main className="flex-grow isolate px-6 py-24 sm:py-32 lg:px-8">
      <Routes>
        <Route path="/" element={<Navigate to="/candidatoes" replace={true} />} />
        <Route path="/candidatoes" element={<CandidatoesList/>} />
        <Route path="/candidatoes/novo" element={<FormularioCandidato />} />
        <Route path="/loader" element={<Loader />} />
      </Routes>
      </main>
      </AuthenticatedTemplate>
      
      </div>
    </NotificationContext.Provider>
    </MsalProvider>
  )
}
