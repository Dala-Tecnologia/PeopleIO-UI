import './App.css'
import { useState } from 'react';
import Header from '@/components/base/Header'
import { FormularioColaborador } from './components/form/FormularioColaborador'
import { Routes, Route, Navigate } from "react-router-dom";
import { ColaboradoresList } from './components/colaborador-list/colaborador-list';
import { Loader } from './components/ui/loader';
import { Notification } from './components/ui/Notification';
import { NotificationContext } from './components/ui/NotificationContext';
import type { NotificationData } from './components/ui/NotificationContext';

export default function App() {
  const [notification, setNotification] = useState<NotificationData | null>(null);

  const showNotification = (notificationData: NotificationData) => {
    setNotification(notificationData);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      <div className="flex flex-col min-h-screen">
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={hideNotification} />
      )}
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
      </div>
    </NotificationContext.Provider>
  )
}
