import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { STAFF_PINS, MODO_PRUEBA } from '../config.js';
import { procesarCheckin, obtenerContador } from '../dataLayer.js';
import '../styles/staff.css';

export default function Staff() {
  const [autorizado, setAutorizado] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [counter, setCounter] = useState(0);
  const [flashKind, setFlashKind] = useState(''); // '', 'ok', 'bad'
  const [resultado, setResultado] = useState(null); // { kind, titulo, subtitulo, hint }
  const [manualCode, setManualCode] = useState('');

  const readerRef = useRef(null);
  const qrRef = useRef(null);
  const scanningRef = useRef(true);
  const readerErrorRef = useRef(false);

  useEffect(() => {
    if (!autorizado) return;
    obtenerContador().then(setCounter).catch(() => {});

    const qr = new Html5Qrcode('reader');
    qrRef.current = qr;
    qr.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      (decodedText) => procesarCodigo(decodedText.trim()),
      () => {}
    ).catch(() => { readerErrorRef.current = true; });

    return () => {
      qr.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autorizado]);

  function entrar() {
    if (STAFF_PINS.includes(pin.trim())) {
      setAutorizado(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

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

      {!autorizado && (
        <div id="gate">
          <div className="eyebrow">Personal autorizado</div>
          <h1>Ingresa tu PIN</h1>
          <input
            maxLength={4}
            inputMode="numeric"
            placeholder="••••"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') entrar(); }}
          />
          <button onClick={entrar}>Entrar</button>
          {pinError && <div className="err" style={{ display: 'block' }}>PIN incorrecto.</div>}
        </div>
      )}

      {autorizado && (
        <div id="scannerView" style={{ display: 'block' }}>
          {MODO_PRUEBA && (
            <div className="test-banner">MODO PRUEBA — datos de ejemplo, no conectado a la base de datos real</div>
          )}
          <div className="topbar">
            <div className="eyebrow">Control de ingreso</div>
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
        </div>
      )}
    </>
  );
}
