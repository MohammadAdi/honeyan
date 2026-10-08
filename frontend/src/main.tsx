import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {AuthProvider, useAuth} from './auth/AuthContext.tsx';
import {LoginView} from './components/auth/LoginView.tsx';
import './index.css';

function AuthenticatedApplication() {
  const {user, loading} = useAuth();
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F1F5F9] text-sm font-semibold text-[#64748B] dark:bg-[#1A222C] dark:text-[#AEB7C0]">Loading...</div>;
  }
  return user ? <App /> : <LoginView />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AuthenticatedApplication />
    </AuthProvider>
  </StrictMode>,
);
