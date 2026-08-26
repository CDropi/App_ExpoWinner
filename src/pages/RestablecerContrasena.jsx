import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { getFirebaseAuth } from '../lib/auth.js';
import { IMAGEN_FONDO_LOGIN, LOGO_LOGIN } from '../config.js';
import { useEsMobil } from '../hooks/useEsMobil.js';
import SoloMobil from '../components/SoloMobil.jsx';
import '../styles/ingreso.css';

// Página propia para el link de "olvidé mi contraseña", en vez de la
// pantalla genérica que aloja Firebase por defecto. El link que manda la
// Cloud Function (solicitarResetContrasena) apunta aquí, con el código de
// seguridad (oobCode) como parámetro en la URL — Firebase ya validó ese
// código antes de generar el link, aquí solo lo confirmamos y dejamos
// escribir la contraseña nueva.
export default function RestablecerContrasena() {
  const esMobil = useEsMobil();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  // 'verificando' | 'listo' | 'invalido' | 'guardando' | 'exito'
  const [estado, setEstado] = useState('verificando');
  const [emailCuenta, setEmailCuenta] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [passwordConfirmValue, setPasswordConfirmValue] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.backgroundImage = `url("${IMAGEN_FONDO_LOGIN}")`;
    return () => { document.body.style.backgroundImage = ''; };
  }, []);

  useEffect(() => {
    if (!oobCode) {
      setEstado('invalido');
      return;
    }
    verifyPasswordResetCode(getFirebaseAuth(), oobCode)
      .then(email => {
        setEmailCuenta(email);
        setEstado('listo');
      })
      .catch(() => setEstado('invalido'));
  }, [oobCode]);

  async function handleGuardar() {
    setError('');
    if (passwordValue.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (passwordValue !== passwordConfirmValue) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setEstado('guardando');
    try {
      await confirmPasswordReset(getFirebaseAuth(), oobCode, passwordValue);
      setEstado('exito');
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar la contraseña. El link puede haber expirado — vuelve a pedir uno nuevo desde la app.');
      setEstado('listo');
    }
  }

  if (!esMobil) {
    return <SoloMobil />;
  }

  return (
    <div id="mainContent" className="visible" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="login-card" id="restablecerCard">
        <h1 className="login-title">Recupera tu contraseña</h1>
        <img className="login-logo" src={LOGO_LOGIN} alt="Logo" />

        {estado === 'verificando' && (
          <p className="login-subtitle">Verificando el link...</p>
        )}

        {estado === 'invalido' && (
          <>
            <p className="login-subtitle">
              <strong>Este link ya no es válido</strong> <br/><br/> Puede haber expirado o ya haberse usado antes.
            </p>
            <Link to="/" className="login-button" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Volver a la app
            </Link>
          </>
        )}

        {(estado === 'listo' || estado === 'guardando') && (
          <>
            <p className="login-subtitle">Cuenta: <strong>{emailCuenta.replace('@expowinners.app', '')}</strong></p>
            <label htmlFor="pwNueva" className="sr-only">Nueva contraseña</label>
            <div className="staff-password-wrap">
              <input
                id="pwNueva"
                type={mostrarPassword ? 'text' : 'password'}
                className="login-input staff-password-input"
                autoComplete="new-password"
                placeholder="Nueva contraseña"
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleGuardar(); }}
              />
              <button
                type="button"
                className="staff-password-toggle"
                onClick={() => setMostrarPassword(v => !v)}
                aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <img src={mostrarPassword ? '/media/NoVer.svg' : '/media/Ver.svg'} alt="" />
              </button>
            </div>
            <label htmlFor="pwConfirmar" className="sr-only">Confirmar contraseña</label>
            <div className="staff-password-wrap">
              <input
                id="pwConfirmar"
                type={mostrarPassword ? 'text' : 'password'}
                className="login-input staff-password-input"
                autoComplete="new-password"
                placeholder="Confirmar contraseña"
                value={passwordConfirmValue}
                onChange={e => setPasswordConfirmValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleGuardar(); }}
              />
              <button
                type="button"
                className="staff-password-toggle"
                onClick={() => setMostrarPassword(v => !v)}
                aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <img src={mostrarPassword ? '/media/NoVer.svg' : '/media/Ver.svg'} alt="" />
              </button>
            </div>
            {error && <div className="error-msg" style={{ display: 'block' }}>{error}</div>}
            <button className="login-button" disabled={estado === 'guardando'} onClick={handleGuardar}>
              {estado === 'guardando' ? <><span className="spinner" />Guardando...</> : 'Restablecer'}
            </button>
          </>
        )}

        {estado === 'exito' && (
          <>
            <p className="login-subtitle">Tu contraseña se actualizó correctamente.</p>
            <Link to="/" className="login-button" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Iniciar sesión
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
