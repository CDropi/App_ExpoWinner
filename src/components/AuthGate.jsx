import { useEffect, useState } from 'react';
import { loginStaff, onStaffAuthChange, logoutStaff } from '../lib/auth.js';
import { LOGO_LOGIN, IMAGEN_FONDO_LOGIN, LOGO_LOGIN_STAFF } from '../config.js';

// Envuelve cualquier pantalla (Staff, Admin) y exige una sesión real de
// Firebase Auth (correo + contraseña) antes de mostrar el contenido.
//
// Uso:
//   <AuthGate contexto="Staff" descripcion="Valida el ingreso de los asistentes." footerDestino="acceder al sistema de escaneo.">
//     {(user, cerrarSesion) => ( ...contenido normal de la pantalla... )}
//   </AuthGate>
export default function AuthGate({
  children,
  contexto = 'equipo interno',
  descripcion = 'Ingresa con tus credenciales para continuar.',
  footerDestino = 'acceder a esta sección.',
}) {
  // undefined = todavía no sabemos (cargando), null = sin sesión, objeto = con sesión
  const [user, setUser] = useState(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const unsub = onStaffAuthChange(u => setUser(u));
    return unsub;
  }, []);

  // Fondo con textura mientras se muestra el formulario de login (igual
  // que en el login público); se quita apenas hay sesión iniciada.
  useEffect(() => {
    if (user) return;
    document.body.style.backgroundImage = `url("${IMAGEN_FONDO_LOGIN}")`;
    return () => { document.body.style.backgroundImage = ''; };
  }, [user]);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y tu contraseña');
      return;
    }
    setCargando(true);
    try {
      await loginStaff(email.trim(), password);
      // onStaffAuthChange se encarga de actualizar "user" solo.
    } catch (err) {
      console.error(err);
      setError('Correo o contraseña incorrectos');
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
      <div className="login-card staff-login-card">
        <div className="Title-Staff">
          <h1 className="login-title">Bienvenido</h1>
          <p className="staff-login-al">al {contexto} de</p>
        </div>        
        <img className="login-logo-Staff" src={LOGO_LOGIN_STAFF} alt="Logo" />
        <div className="login-register">
          Ingresa las credenciales asignadas para<br/>
          <strong>acceder al sistema de escaneo</strong>
        </div>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="login-input staff-login-input"
            placeholder="Correo"
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div className="staff-password-wrap">
            <input
              type={mostrarPassword ? 'text' : 'password'}
              className="login-input staff-login-input staff-password-input"
              placeholder="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="staff-password-toggle"
              onClick={() => setMostrarPassword(v => !v)}
              aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {mostrarPassword ? (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 3.5l17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  <path d="M10.6 5.4a10.6 10.6 0 0 1 1.4-.1c5 0 8.7 3.3 10 6.7-.5 1.3-1.3 2.6-2.4 3.7m-2.9 2.1A10.9 10.9 0 0 1 12 19.2c-5 0-8.7-3.3-10-6.7a12 12 0 0 1 3.4-4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.9 10a3.1 3.1 0 0 0 4.3 4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12.5c1.3-3.4 5-6.7 10-6.7s8.7 3.3 10 6.7c-1.3 3.4-5 6.7-10 6.7s-8.7-3.3-10-6.7Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12.5" r="3.1" stroke="currentColor" strokeWidth="1.6"/>
                </svg>
              )}
            </button>
          </div>
          {error && <div className="error-msg" style={{ display: 'block' }}>{error}</div>}
          <button type="submit" className="staff-login-button" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>        
      </div>
    );
  }

  // Con sesión: mostrar el contenido real de la pantalla
  return children(user, logoutStaff);
}
