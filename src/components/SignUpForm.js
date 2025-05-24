import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const SignUpForm = ({ onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');               // Nuevo estado para nombre
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    // 1. Crear usuario en Auth (correo + pass)
    const { user, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // 2. Insertar datos en tabla 'users' (id = user.id)
    const { error: dbError } = await supabase.from('users').insert([
      {
        id: user.id,     // Usa mismo ID que auth para relacionar bien
        email,
        name,
        role: 'user',    // O cambia si quieres rol dinámico
      },
    ]);

    if (dbError) {
      setError('Error guardando datos de usuario: ' + dbError.message);
      setLoading(false);
      return;
    }

    setMessage('Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
    setEmail('');
    setName('');
    setPassword('');
    setLoading(false);

    if (onSignUpSuccess) onSignUpSuccess();
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-gray-800 rounded-lg">
      <h2 className="text-white text-2xl mb-4">Crear cuenta</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {message && <p className="text-green-500 mb-2">{message}</p>}
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-yellow-500 text-gray-900 rounded font-semibold hover:bg-yellow-600"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
