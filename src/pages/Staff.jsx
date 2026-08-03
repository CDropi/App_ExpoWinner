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
  const [detalleDragOffset, setDetalleDragOffset] = useState(0);
  const [detalleDragging, setDetalleDragging] = useState(false);
  const [busquedaAsistente, setBusquedaAsistente] = useState('');

  const detallePanelRef = useRef(null);
  const detalleDragStateRef = useRef({ startY: 0, dragging: false });

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

  // "DÍA 1" -> "DÍA 1 · 12 SEP" (toma la fecha configurada en EVENTO.dias)
  function etiquetaDiaConFecha(diaId) {
    const dia = EVENTO.dias.find(d => d.id === diaId);
    return dia?.fecha ? `DÍA ${diaId} · ${dia.fecha}` : `DÍA ${diaId}`;
  }

  async function procesarCodigo(ticketCode) {
    if (!scanningRef.current) return;
    scanningRef.current = false;

    try {
      const r = await procesarCheckin(ticketCode);
      if (r.ok) {
        flash('ok');
        mostrarResultado({ kind: 'ok', titulo: r.data.nombre || 'Asistente', subtitulo: `✓ INGRESO VÁLIDO · ${etiquetaDiaConFecha(r.data.dia)}` });
        setContadores(c => ({ ...c, [r.data.dia]: (c[r.data.dia] || 0) + 1 }));
      } else if (r.reason === 'already_used') {
        flash('bad');
        mostrarResultado({ kind: 'bad', titulo: r.data.nombre || 'Asistente', subtitulo: `✕ YA INGRESÓ · ${etiquetaDiaConFecha(r.data.dia)}`, hint: 'Este código ya fue validado anteriormente.' });
      } else if (r.reason === 'dia_incorrecto') {
        flash('bad');
        mostrarResultado({ kind: 'bad', titulo: r.data.nombre || 'Asistente', subtitulo: `✕ ENTRADA DE OTRO DÍA (${etiquetaDiaConFecha(r.data.dia)})`, hint: 'Esta entrada no corresponde al día de hoy. No se marcó como usada.' });
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
    setBusquedaAsistente('');
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
    setDetalleDragOffset(0);
    setBusquedaAsistente('');
  }

  // Arrastre para cerrar el panel de asistentes deslizándolo hacia abajo.
  function handleDetallePointerDown(e) {
    detalleDragStateRef.current = { startY: e.clientY, dragging: true };
    setDetalleDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function handleDetallePointerMove(e) {
    if (!detalleDragStateRef.current.dragging) return;
    const delta = e.clientY - detalleDragStateRef.current.startY;
    if (delta > 0) setDetalleDragOffset(delta);
  }

  function handleDetallePointerUp() {
    if (!detalleDragStateRef.current.dragging) return;
    detalleDragStateRef.current.dragging = false;
    setDetalleDragging(false);
    const altura = detallePanelRef.current?.offsetHeight || 400;
    if (detalleDragOffset > altura * 0.22) {
      cerrarDetalle();
    } else {
      setDetalleDragOffset(0);
    }
  }

  function escaparCampoCSV(valor) {
    const texto = String(valor ?? '');
    return /[",\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
  }

  // Genera un .csv con la lista de asistentes ya ingresados ese día y
  // dispara su descarga directamente en el navegador del staff.
  function descargarCSV() {
    if (!detalleLista.length) return;
    const etiqueta = EVENTO.dias.find(d => d.id === detalleDia)?.etiqueta || `Dia ${detalleDia}`;
    const encabezados = ['#', 'Nombre', 'Telefono', 'Correo', 'Codigo'];
    const filas = detalleLista.map((p, idx) => [idx + 1, p.nombre || '', p.telefono || '', p.correo || '', p.ticketCode || '']);
    const csv = [encabezados, ...filas].map(fila => fila.map(escaparCampoCSV).join(',')).join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ingresos-${etiqueta.toLowerCase().replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Filtra la lista de asistentes por nombre, código, correo o teléfono.
  const detalleListaFiltrada = (() => {
    const q = busquedaAsistente.trim().toLowerCase();
    if (!q) return detalleLista;
    return detalleLista.filter(p =>
      (p.nombre || '').toLowerCase().includes(q) ||
      (p.telefono || '').toLowerCase().includes(q) ||
      (p.correo || '').toLowerCase().includes(q) ||
      (p.ticketCode || '').toLowerCase().includes(q)
    );
  })();

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
              <div className="rname">{resultado.titulo}</div>
              <div className={`staff-result-icon ${resultado.kind}`}>
                {resultado.kind === 'ok' ? '✓' : '✕'}
              </div>              
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
          <div
            ref={detallePanelRef}
            className="staff-detalle-panel"
            style={{ transform: `translateY(${detalleDragOffset}px)`, transition: detalleDragging ? 'none' : undefined }}
            onPointerDown={handleDetallePointerDown}
            onPointerMove={handleDetallePointerMove}
            onPointerUp={handleDetallePointerUp}
            onPointerCancel={handleDetallePointerUp}
          >
            <span className="staff-detalle-handle" />
            <div className="staff-detalle-header">
              <div>
                <div className="staff-detalle-eyebrow">Lista de Ingresos</div>
                <div className="staff-detalle-title">
                  {EVENTO.dias.find(d => d.id === detalleDia)?.etiqueta}
                </div>
              </div>
              <div className="staff-detalle-total">
                {detalleLista.length} {detalleLista.length === 1 ? 'registro' : 'registros'}
              </div>
            </div>

            <div className="staff-detalle-toolbar">
              <div className="staff-detalle-search">
                <svg className="staff-detalle-search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M20 20l-3.8-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  className="staff-detalle-search-input"
                  placeholder="Buscar por nombre, código, correo o teléfono"
                  value={busquedaAsistente}
                  onChange={e => setBusquedaAsistente(e.target.value)}
                />
                {busquedaAsistente && (
                  <button
                    type="button"
                    className="staff-detalle-search-clear"
                    onClick={() => setBusquedaAsistente('')}
                    aria-label="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="button"
                className="staff-detalle-download"
                onClick={descargarCSV}
                disabled={!detalleLista.length}
                aria-label="Descargar CSV"
              >
                <img src="/media/Download.svg" alt="" />
              </button>
            </div>

            <div className="staff-detalle-lista">
              {detalleCargando && <div className="staff-detalle-vacio">Cargando...</div>}
              {!detalleCargando && detalleLista.length === 0 && (
                <div className="staff-detalle-vacio">Todavía nadie ha ingresado este día.</div>
              )}
              {!detalleCargando && detalleLista.length > 0 && detalleListaFiltrada.length === 0 && (
                <div className="staff-detalle-vacio">No se encontró ningún asistente con "{busquedaAsistente}".</div>
              )}
              {!detalleCargando && detalleListaFiltrada.map(persona => (
                <div key={persona.ticketCode} className="staff-detalle-item">
                  <div className="staff-detalle-row-top">
                    <span className="staff-detalle-nombre">{persona.nombre || 'Sin nombre'}</span>
                    <span className="staff-detalle-codigo">{persona.ticketCode}</span>
                  </div>
                  <div className="staff-detalle-divider" />
                  <div className="staff-detalle-row-bottom">
                    <span className="staff-detalle-dato">
                      <img className="staff-detalle-icon" src="/media/Tel.svg" alt="" />
                      {persona.telefono || '—'}
                    </span>
                    <span className="staff-detalle-dato">
                      <img className="staff-detalle-icon" src="/media/Email.svg" alt="" />
                      {persona.correo || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
