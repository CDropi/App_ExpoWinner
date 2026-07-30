import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { MODO_PRUEBA, IMAGEN_FONDO_LOGIN, LOGO_LOGIN } from '../config.js';
import { procesarCheckin, obtenerContador } from '../lib/dataLayer.js';
import { useEsMobil } from '../hooks/useEsMobil.js';
import SoloMobil from '../components/SoloMobil.jsx';
import AuthGate from '../components/AuthGate.jsx';
import '../styles/staff.css';

// Arma "Carlos Diaz" a partir de "carlos.diaz@dropi.co" — toma la parte
// antes del @, la separa por puntos, y pone mayúscula inicial a cada parte.
function nombreDesdeCorreo(email) {
  if (!email) return 'Colaborador';
  const local = email.split('@')[0] || '';
  const partes = local.split(/[._-]+/).filter(Boolean);
  if (partes.length === 0) return 'Colaborador';
  return partes
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

export default function Staff() {
  const esMobil = useEsMobil();
  if (!esMobil) return <SoloMobil />;

  return (
    <AuthGate
      contexto="Staff"
      descripcion="Valida el ingreso de los asistentes."
      footerDestino="acceder al sistema de escaneo."
    >
      {(usuario, cerrarSesion) => <ScannerView usuario={usuario} onLogout={cerrarSesion} />}
    </AuthGate>
  );
}

function ScannerView({ usuario, onLogout }) {
  const [counter, setCounter] = useState(0);
  const [flashKind, setFlashKind] = useState(''); // '', 'ok', 'bad'
  const [resultado, setResultado] = useState(null); // { kind, titulo, subtitulo, hint }
  const [manualCode, setManualCode] = useState('');

  const readerRef = useRef(null);
  const qrRef = useRef(null);
  const scanningRef = useRef(true);
  const readerErrorRef = useRef(false);

  // Mismo fondo con textura que usa el resto de la app (login público y
  // login de staff) — sin esto, la pantalla del escáner quedaba con el
  // fondo plano de base.css apenas se iniciaba sesión.
  useEffect(() => {
    document.body.style.backgroundImage = `url("${IMAGEN_FONDO_LOGIN}")`;
    return () => { document.body.style.backgroundImage = ''; };
  }, []);


  useEffect(() => {
    obtenerContador().then(setCounter).catch(() => {});

    const qr = new Html5Qrcode('reader');
    qrRef.current = qr;
    let escaneando = false;
    let desmontado = false;

    qr.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      (decodedText) => procesarCodigo(decodedText.trim()),
      () => {}
    ).then(() => {
      escaneando = true;
      // Si ya nos desmontamos mientras la cámara arrancaba, detenerla ahora.
      if (desmontado) qr.stop().catch(() => {});
    }).catch(() => { readerErrorRef.current = true; });

    return () => {
      desmontado = true;
      // Si la cámara ya estaba corriendo, la detenemos de inmediato. Si
      // todavía estaba arrancando, el .then() de arriba se encarga.
      if (!escaneando) return;
      try {
        qr.stop().catch(() => {});
      } catch (e) {
        // no-op: puede pasar en desmontajes muy rápidos (ej. modo desarrollo de React)
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function flash(kind) {
    setFlashKind(kind);
    setTimeout(() => setFlashKind(''), 350);
  }

  async function procesarCodigo(ticketCode) {
    if (!scanningRef.current) return;
    scanningRef.current = false;

    try {
      const r = await procesarCheckin(ticketCode);
      if (r.ok) {
        flash('ok');
        setResultado({ kind: 'ok', titulo: r.data.nombre || 'Asistente', subtitulo: `✓ INGRESO VÁLIDO · DÍA ${r.data.dia}` });
        setCounter(c => c + 1);
      } else if (r.reason === 'already_used') {
        flash('bad');
        setResultado({ kind: 'bad', titulo: r.data.nombre || 'Asistente', subtitulo: `✕ YA INGRESÓ · DÍA ${r.data.dia}`, hint: 'Este código ya fue validado anteriormente.' });
      } else if (r.reason === 'dia_incorrecto') {
        flash('bad');
        setResultado({ kind: 'bad', titulo: r.data.nombre || 'Asistente', subtitulo: `✕ ENTRADA DE OTRO DÍA (DÍA ${r.data.dia})`, hint: 'Esta entrada no corresponde al día de hoy. No se marcó como usada.' });
      } else {
        flash('bad');
        setResultado({ kind: 'bad', titulo: 'Código no encontrado', subtitulo: '✕ ENTRADA INVÁLIDA', hint: 'Este QR no corresponde a ninguna entrada registrada.' });
      }
    } catch (err) {
      console.error(err);
      flash('bad');
      setResultado({ kind: 'bad', titulo: 'Error de lectura', subtitulo: '✕ INTENTA DE NUEVO' });
    } finally {
      setTimeout(() => { scanningRef.current = true; }, 1800);
    }
  }

  return (
    <>
      <div id="flash" className={flashKind ? `show ${flashKind}` : ''} />

      <div id="scannerView" style={{ display: 'flex' }}>
        <div className="staff-header">
          <img className="staff-header-avatar" src={LOGO_LOGIN} alt="Logo" />
          <div className="staff-header-info">
            <div className="staff-header-greeting">Bienvenido al staff</div>
            <div className="staff-header-name">{nombreDesdeCorreo(usuario?.email)}</div>
          </div>
          <button className="staff-logout" onClick={onLogout} aria-label="Cerrar sesión">
            <img src="/media/LogOut.svg" alt="" />
          </button>
        </div>

        <div className="staff-counter-row">
          <div className="staff-counter-badge">
            <div className="staff-counter-label">Conteo de ingresos</div>
            <div className="staff-counter-value">{counter}</div>
          </div>
        </div>

        <div className="staff-intro">
          <h1 className="staff-intro-title">Control de ingreso</h1>
          <p className="staff-intro-sub">
            Apunta la cámara hacia el código QR del asistente para validar su ingreso de forma inmediata.
          </p>
        </div>

        <div className="staff-scanner-frame">
          <div id="reader" ref={readerRef} />
          <span className="staff-scanner-corner tl" />
          <span className="staff-scanner-corner br" />
        </div>

        <div id="resultPanel" className={resultado?.kind || ''}>
          {!resultado && (
            <div className="rname">Otorga permiso de cámara para comenzar a validar entradas.</div>
          )}
          {resultado && (
            <>
              <div className="rname">{resultado.titulo}</div>
              <div className={`rstatus ${resultado.kind}`}>{resultado.subtitulo}</div>
              {resultado.hint && <div className="rhint">{resultado.hint}</div>}
            </>
          )}
        </div>

        {MODO_PRUEBA && (
          <div className="test-banner">MODO PRUEBA — datos de ejemplo, no conectado a la base de datos real</div>
        )}

        <div id="manualTest" style={{ display: 'block' }}>
          <div className="staff-manual-title">
            ¿La cámara no inicia o no lee el código? <strong>Valida el ingreso escribiéndolo manualmente.</strong>
          </div>
          <div className="manual-row">
            <input
              className="staff-manual-input"
              placeholder="Escribe o pega el código de la entrada"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && manualCode.trim()) procesarCodigo(manualCode.trim()); }}
            />
            <button className="staff-manual-button" onClick={() => { if (manualCode.trim()) procesarCodigo(manualCode.trim()); }}>
              Validar código
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
