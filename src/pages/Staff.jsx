import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { MODO_PRUEBA, IMAGEN_FONDO_LOGIN, LOGO_LOGIN, EVENTO } from '../config.js';
import { procesarCheckin, obtenerContadoresPorDia, obtenerAsistentesIngresados } from '../lib/dataLayer.js';
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
  const [contadores, setContadores] = useState({}); // { 1: n, 2: n }
  const [flashKind, setFlashKind] = useState(''); // '', 'ok', 'bad'
  const [resultado, setResultado] = useState(null); // { kind, titulo, subtitulo, hint }
  const [panelVisible, setPanelVisible] = useState(false); // controla el deslizamiento de la pestaña de resultado
  const [dragOffset, setDragOffset] = useState(0); // px arrastrados hacia abajo mientras el usuario desliza la hoja
  const [isDragging, setIsDragging] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [manualError, setManualError] = useState('');

  const sheetRef = useRef(null);
  const dragStateRef = useRef({ startY: 0, dragging: false });

  const [detalleDia, setDetalleDia] = useState(null); // id del día abierto, o null
  const [detalleLista, setDetalleLista] = useState([]);
  const [detalleCargando, setDetalleCargando] = useState(false);

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
    obtenerContadoresPorDia().then(setContadores).catch(() => {});

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

  // Arrastre para cerrar la hoja de resultado deslizándola hacia abajo.
  function handleSheetPointerDown(e) {
    if (!panelVisible) return;
    dragStateRef.current = { startY: e.clientY, dragging: true };
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function handleSheetPointerMove(e) {
    if (!dragStateRef.current.dragging) return;
    const delta = e.clientY - dragStateRef.current.startY;
    if (delta > 0) setDragOffset(delta);
  }

  function handleSheetPointerUp() {
    if (!dragStateRef.current.dragging) return;
    dragStateRef.current.dragging = false;
    setIsDragging(false);
    const alturaHoja = sheetRef.current?.offsetHeight || 400;
    if (dragOffset > alturaHoja * 0.22) {
      ocultarResultado();
    } else {
      setDragOffset(0);
    }
  }

  function flash(kind) {
    setFlashKind(kind);
    setTimeout(() => setFlashKind(''), 350);
  }

  // Muestra la pestaña de resultado deslizándola a la vista. Ya no se
  // oculta sola: el staff la cierra tocando fuera, deslizándola hacia
  // abajo, o con el botón "Seguir escaneando".
  function mostrarResultado(datos) {
    setResultado(datos);
    setPanelVisible(true);
    setDragOffset(0);
  }

  function ocultarResultado() {
    setPanelVisible(false);
    setDragOffset(0);
  }

  async function procesarCodigo(ticketCode) {
    if (!scanningRef.current) return;
    scanningRef.current = false;

    try {
      const r = await procesarCheckin(ticketCode);
      if (r.ok) {
        flash('ok');
        mostrarResultado({ kind: 'ok', titulo: r.data.nombre || 'Asistente', subtitulo: `✓ INGRESO VÁLIDO · DÍA ${r.data.dia}` });
        setContadores(c => ({ ...c, [r.data.dia]: (c[r.data.dia] || 0) + 1 }));
      } else if (r.reason === 'already_used') {
        flash('bad');
        mostrarResultado({ kind: 'bad', titulo: r.data.nombre || 'Asistente', subtitulo: `✕ YA INGRESÓ · DÍA ${r.data.dia}`, hint: 'Este código ya fue validado anteriormente.' });
      } else if (r.reason === 'dia_incorrecto') {
        flash('bad');
        mostrarResultado({ kind: 'bad', titulo: r.data.nombre || 'Asistente', subtitulo: `✕ ENTRADA DE OTRO DÍA (DÍA ${r.data.dia})`, hint: 'Esta entrada no corresponde al día de hoy. No se marcó como usada.' });
      } else {
        flash('bad');
        mostrarResultado({ kind: 'bad', titulo: 'Código no encontrado', subtitulo: '✕ ENTRADA INVÁLIDA', hint: 'Este QR no corresponde a ninguna entrada registrada.' });
      }
    } catch (err) {
      console.error(err);
      flash('bad');
      mostrarResultado({ kind: 'bad', titulo: 'Error de lectura', subtitulo: '✕ INTENTA DE NUEVO' });
    } finally {
      setTimeout(() => { scanningRef.current = true; }, 1800);
    }
  }

  function validarCodigoManual() {
    const code = manualCode.trim();
    if (!code) {
      setManualError('Por favor ingresa un código');
      return;
    }
    setManualError('');
    procesarCodigo(code);
  }

  async function abrirDetalle(diaId) {
    setDetalleDia(diaId);
    setDetalleCargando(true);
    try {
      const lista = await obtenerAsistentesIngresados(diaId);
      setDetalleLista(lista);
    } catch (err) {
      console.error(err);
      setDetalleLista([]);
    } finally {
      setDetalleCargando(false);
    }
  }

  function cerrarDetalle() {
    setDetalleDia(null);
    setDetalleLista([]);
  }

  return (
    <>
      <div id="flash" className={flashKind ? `show ${flashKind}` : ''} />

      <div
        className={`staff-result-backdrop ${panelVisible ? 'show' : ''}`}
        onClick={ocultarResultado}
      />
      <div
        ref={sheetRef}
        id="resultSheet"
        className={`staff-result-sheet ${resultado?.kind || ''} ${panelVisible ? 'show' : ''} ${isDragging ? 'dragging' : ''}`}
        style={panelVisible ? { transform: `translate(-50%, ${dragOffset}px)` } : undefined}
        onPointerDown={handleSheetPointerDown}
        onPointerMove={handleSheetPointerMove}
        onPointerUp={handleSheetPointerUp}
        onPointerCancel={handleSheetPointerUp}
        role="status"
        aria-live="polite"
      >
        {resultado && (
          <>
            <span className="staff-result-handle" />
            <div className="staff-result-content">
              <div className={`staff-result-icon ${resultado.kind}`}>
                {resultado.kind === 'ok' ? '✓' : '✕'}
              </div>
              <div className="rname">{resultado.titulo}</div>
              <div className="rstatus">{resultado.subtitulo}</div>
              {resultado.hint && <div className="rhint">{resultado.hint}</div>}
            </div>
            <button type="button" className="staff-result-close" onClick={ocultarResultado}>
              Seguir escaneando
            </button>
          </>
        )}
      </div>

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

        <h1 className="staff-intro-title staff-section-title">Control de ingreso</h1>

        <div className="staff-day-cards">
          {EVENTO.dias.map(dia => (
            <div key={dia.id} className="staff-day-card">
              <button
                type="button"
                className="staff-day-card-top"
                onClick={() => abrirDetalle(dia.id)}
                aria-label={`Ver detalle de ${dia.etiqueta}`}
              >
                <span className="staff-day-card-live" />
                <span className="staff-day-card-title">{dia.etiqueta}</span>
                <img className="staff-day-card-chevron" src="/media/Arrow.svg" alt="" />
              </button>
              <div className="staff-day-card-count">{contadores[dia.id] || 0}</div>
            </div>
          ))}
        </div>


        <div className="staff-divider" />

        <div className="staff-intro">
          <p className="staff-intro-sub">
            Escanea el QR para <strong>validar el ingreso</strong>
          </p>
        </div>

        <div className="staff-scanner-frame">
          <div id="reader" ref={readerRef} />
          <span className="staff-scanner-corner tl" />
          <span className="staff-scanner-corner tr" />
          <span className="staff-scanner-corner bl" />
          <span className="staff-scanner-corner br" />
        </div>

        {MODO_PRUEBA && (
          <div className="test-banner">MODO PRUEBA — datos de ejemplo, no conectado a la base de datos real</div>
        )}

        <div id="manualTest" style={{ display: 'block' }}>
          <div className="staff-manual-title">
            O ingresa el código <strong>manualmente</strong>
          </div>
          <div className="manual-row">
            <input
              className="login-input staff-login-input"
              placeholder="Escribe el código de la entrada"
              value={manualCode}
              onChange={e => { setManualCode(e.target.value); if (manualError) setManualError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') validarCodigoManual(); }}
            />
            <button className="staff-login-button" onClick={validarCodigoManual}>
              Validar código
            </button>
          </div>
          {manualError && <div className="error-msg" style={{ display: 'block' }}>{manualError}</div>}
        </div>
      </div>

      {detalleDia && (
        <div className="staff-detalle-overlay" onClick={e => { if (e.target === e.currentTarget) cerrarDetalle(); }}>
          <div className="staff-detalle-panel">
            <div className="staff-detalle-header">
              <div>
                <div className="staff-detalle-eyebrow">Ingresos registrados</div>
                <div className="staff-detalle-title">
                  {EVENTO.dias.find(d => d.id === detalleDia)?.etiqueta} · {detalleLista.length} de {contadores[detalleDia] || 0}
                </div>
              </div>
              <button type="button" className="staff-detalle-close" onClick={cerrarDetalle} aria-label="Cerrar">✕</button>
            </div>

            <div className="staff-detalle-lista">
              {detalleCargando && <div className="staff-detalle-vacio">Cargando...</div>}
              {!detalleCargando && detalleLista.length === 0 && (
                <div className="staff-detalle-vacio">Todavía nadie ha ingresado este día.</div>
              )}
              {!detalleCargando && detalleLista.map(persona => (
                <div key={persona.ticketCode} className="staff-detalle-item">
                  <div className="staff-detalle-nombre">{persona.nombre || 'Sin nombre'}</div>
                  <div className="staff-detalle-dato">📱 {persona.telefono || '—'}</div>
                  <div className="staff-detalle-dato">✉️ {persona.correo || '—'}</div>
                  <div className="staff-detalle-codigo">{persona.ticketCode}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
