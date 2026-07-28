import { useEffect, useState } from 'react';
import { loginStaff, onStaffAuthChange, logoutStaff } from './auth.js';

// Envuelve cualquier pantalla (Staff, Admin) y exige una sesión real de
// Firebase Auth (correo + contraseña) antes de mostrar el contenido.
//
// Uso:
//   <AuthGate titulo="Personal autorizado">
//     {(user, cerrarSesion) => ( ...contenido normal de la pantalla... )}
//   </AuthGate>
export default function AuthGate({ children, titulo = 'Acceso restringido' }) {
  // undefined = todavía no sabemos (cargando), null = sin sesión, objeto = con sesión
  const [user, setUser] = useState(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const unsub = onStaffAuthChange(u => setUser(u));
    return unsub;
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y tu contraseña.');
      return;
    }
    setCargando(true);
    try {
      await loginStaff(email.trim(), password);
      // onStaffAuthChange se encarga de actualizar "user" solo.
    } catch (err) {
      console.error(err);
      setError('Correo o contraseña incorrectos.');
    } finally {
      setCargando(false);
    }
  }

  // Aún no sabemos si hay sesión (primer instante de carga de la página)
  if (user === undefined) {
    return <div className="auth-gate-loading"><span className="spinner" /></div>;
  }

  // Sin sesión: mostrar el formulario de correo/contraseña
  if (!user) {
    return (
      <div id="gate">
        <div className="eyebrow">{titulo}</div>
        <h1>Inicia sesión</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo"
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Entrar'}
          </button>
          {error && <div className="err" style={{ display: 'block' }}>{error}</div>}
        </form>
      </div>
    );
  }

  // Con sesión: mostrar el contenido real de la pantalla
  return children(user, logoutStaff);
}
