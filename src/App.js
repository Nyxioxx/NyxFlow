import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from './supabaseClient';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    // Detectar sesión actual de Supabase
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setCurrentUser(data.session.user);
    });

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  return (
    <div className="App">
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-2xl font-bold text-yellow-500">NyxFlow</h1>
        <p className="text-sm text-gray-400">Registro profesional de cobros de la empresa Nyxioxx S.A</p>
      </header>

      {!currentUser ? (
        showSignUp ? (
          <>
            <SignUpForm onSignUpSuccess={() => setShowSignUp(false)} />
            <p className="text-center text-white mt-4">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => setShowSignUp(false)}
                className="text-yellow-500 underline"
              >
                Iniciar sesión
              </button>
            </p>
          </>
        ) : (
          <>
            <LoginForm onLogin={handleLogin} />
            <p className="text-center text-white mt-4">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => setShowSignUp(true)}
                className="text-yellow-500 underline"
              >
                Regístrate
              </button>
            </p>
          </>
        )
      ) : currentUser.email === 'info@nyxioxx.com' ? (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <UserDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
