import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { MODO_PRUEBA } from '../config.js';
import { procesarCheckin, obtenerContador } from '../dataLayer.js';
import { useEsMobil } from '../useEsMobil.js';
import SoloMobil from '../SoloMobil.jsx';
import AuthGate from '../AuthGate.jsx';
import '../styles/staff.css';

export default function Staff() {
  const esMobil = useEsMobil();
  if (!esMobil) return <SoloMobil />;

  return (
    <AuthGate titulo="Personal autorizado">
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

      <div id="scannerView" style={{ display: 'block' }}>
        {MODO_PRUEBA && (
          <div className="test-banner">MODO PRUEBA — datos de ejemplo, no conectado a la base de datos real</div>
        )}
        <div className="topbar">
          <div>
            <div className="eyebrow">Control de ingreso</div>
            {usuario?.email && <div className="staff-email">{usuario.email}</div>}
          </div>
          <div className="counter">{counter} ingresos</div>
        </div>
        <div id="reader" ref={readerRef} />
        <div id="resultPanel" className={resultado?.kind || ''}>
          {!resultado && <div className="rname">Apunta la cámara al código QR de la entrada</div>}
          {resultado && (
            <>
              <div className="rname">{resultado.titulo}</div>
              <div className={`rstatus ${resultado.kind}`}>{resultado.subtitulo}</div>
              {resultado.hint && <div className="rhint">{resultado.hint}</div>}
            </>
          )}
        </div>
        {MODO_PRUEBA && (
          <div id="manualTest" style={{ display: 'block' }}>
            <div className="manual-label">Prueba manual (sin cámara)</div>
            <div className="manual-row">
              <input
                placeholder="Pega un ticketCode, ej. XJ4K9QAL2P"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && manualCode.trim()) procesarCodigo(manualCode.trim()); }}
              />
              <button onClick={() => { if (manualCode.trim()) procesarCodigo(manualCode.trim()); }}>Simular</button>
            </div>
          </div>
        )}
        <button className="staff-logout" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </>
  );
}
