import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { MODO_PRUEBA, STANDS, PREGUNTAS_EJEMPLO } from '../../config.js';
import { marcarStandCompletado } from '../../lib/dataLayer.js';
import { conNegrillas } from '../../utils/texto.jsx';
import { textoSobre } from '../../utils/color.js';
import BotonRegresar from '../../components/BotonRegresar.jsx';
import '../../styles/actividad.css';

export default function ActividadStand({ stand, persona, completado, standsCompletados, onCompletar, onRegresar }) {
  const preguntas = stand.preguntas || PREGUNTAS_EJEMPLO;
  const [paso, setPaso] = useState(completado ? 'yaCompletado' : 'portada');
  const [seleccionada, setSeleccionada] = useState(null); // índice de la opción marcada (preguntas de selección única)
  const [seleccionMultiple, setSeleccionMultiple] = useState([]); // índices marcados (preguntas de selección múltiple, ej. países de Fénix)
  const [errorQR, setErrorQR] = useState('');

  // Pregunta actual (solo tiene sentido cuando paso es un número, es decir,
  // cuando estamos en el flujo de preguntas y no en portada/scanner/éxito).
  const preguntaActual = typeof paso === 'number' ? preguntas[paso] : null;
  const esMultiple = !!preguntaActual?.multiple;
  const haySeleccion = esMultiple ? seleccionMultiple.length > 0 : seleccionada !== null;

  function comenzar() { setPaso(0); }

  function siguientePregunta() {
    if (!haySeleccion) return;
    setSeleccionada(null);
    setSeleccionMultiple([]);
    setErrorQR('');
    if (paso + 1 < preguntas.length) setPaso(paso + 1);
    else setPaso('scanner');
  }

  function alternarOpcion(i) {
    if (esMultiple) {
      setSeleccionMultiple((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
    } else {
      setSeleccionada(i);
    }
  }

  // Enciende la cámara solo mientras estamos en el paso del scanner, y la
  // apaga apenas salimos de él (o se desmonta el componente).
  useEffect(() => {
    if (paso !== 'scanner') return;

    const qr = new Html5Qrcode('reader-actividad');
    let escaneando = false;
    let desmontado = false;
    let procesando = false;

    async function manejarCodigo(textoDecodificado) {
      if (procesando) return;
      const codigo = textoDecodificado.trim().toUpperCase();
      if (codigo !== stand.qrCode.toUpperCase()) {
        setErrorQR('Este QR no corresponde a este stand. Verifica que sea el código correcto.');
        return;
      }
      procesando = true;
      setErrorQR('');
      try {
        await marcarStandCompletado(persona.id, stand.id);
        onCompletar(stand.id);
        setPaso('exito');
      } catch (err) {
        console.error(err);
        setErrorQR('Ocurrió un error al validar tu código. Intenta de nuevo.');
        procesando = false;
      }
    }

    qr.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (decodedText) => manejarCodigo(decodedText),
      () => {}
    ).then(() => {
      escaneando = true;
      if (desmontado) qr.stop().catch(() => {});
    }).catch(() => {
      setErrorQR('No se pudo acceder a la cámara. Revisa los permisos e intenta de nuevo.');
    });

    return () => {
      desmontado = true;
      if (!escaneando) return;
      try {
        qr.stop().catch(() => {});
      } catch (e) {
        // no-op
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso]);

  // --stand-color: el color de la marca (viene de config.js).
  // --stand-texto: el color de las LETRAS que van encima de ese color.
  //   Se calcula solo: si el color de la marca es oscuro (ej. Fénix
  //   #0d1a5e) las letras quedan blancas; si es claro (ej. Groupack
  //   #fbea20) quedan negras. No hay que configurar nada por marca.
  // const estiloMarca = { '--stand-color': stand.colorPrimario }; // versión anterior (sin contraste automático)
  const estiloMarca = {
    '--stand-color': stand.colorPrimario,
    '--stand-texto': textoSobre(stand.colorPrimario),
  };
  if (stand.imagenFondo) estiloMarca['--stand-bg-image'] = `url("${stand.imagenFondo}")`;
  const claseMarca = `actividad-stand ${stand.imagenFondo ? 'tiene-fondo' : ''}`;

  // ---- SOLO MODO_PRUEBA: simula un escaneo exitoso del QR de este stand,
  // para poder probar el flujo completo sin tener el código físico a mano.
  async function simularEscaneoQR() {
    setErrorQR('');
    try {
      await marcarStandCompletado(persona.id, stand.id);
      onCompletar(stand.id);
      setPaso('exito');
    } catch (err) {
      console.error(err);
      setErrorQR('Ocurrió un error al validar tu código. Intenta de nuevo.');
    }
  }

  const Marca = ({ tamano = 'grande' }) => {
    const src = tamano === 'chico' ? (stand.isotipo || stand.logo) : stand.logo;
    return src
      ? <img className={`actividad-marca-logo ${tamano}`} src={src} alt={stand.nombre} />
      : <span className={`actividad-marca-texto ${tamano}`}>{stand.nombre}</span>;
  };

  const BotonAtras = () => <BotonRegresar onClick={onRegresar} flotante />;

  if (paso === 'yaCompletado' || paso === 'exito') {
    // El beneficio específico solo se revela cuando la persona ya completó
    // TODOS los stands de la Ruta Winner. Así evitamos que alguien complete
    // un solo stand y vaya directo a reclamar el premio sin terminar el
    // recorrido — mientras falten stands, ve un mensaje genérico.
    const rutaCompleta = standsCompletados.length === STANDS.length;
    // Si la persona vuelve a entrar a un stand que ya había completado antes
    // (no lo acaba de validar ahora mismo), mostramos una versión reducida:
    // solo el logo y la caja del beneficio, sin el título "VALIDACIÓN
    // EXITOSA" ni el check — ese momento de celebración ya se mostró antes.
    const esRevisita = paso === 'yaCompletado';

    return (
      <div className={claseMarca} style={estiloMarca}>
        <BotonAtras />
        <div className="actividad-marca-header scanner"><Marca tamano="mediano" /></div>
        <div className={`actividad-exito ${esRevisita ? 'reducida' : ''}`}>
          {!esRevisita && (
            <>
              <h2 className="actividad-exito-titulo">
                VALIDACIÓN<br /><strong>EXITOSA</strong>
              </h2>
              <div className="actividad-exito-check">
                <img src="/media/Check.svg" alt="Validación exitosa" />
              </div>
            </>
          )}
          {esRevisita && (
            <h2 className="actividad-exito-titulo reducido">¡FELICIDADES!</h2>
          )}
          <div className="actividad-exito-premio">
            <span className="actividad-exito-premio-kicker">
              <svg viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg" width="11" height="11">
                <path d="M12 2.5l2.9 6.4 6.9.7-5.2 4.8 1.5 6.9L12 17.9l-6.1 3.4 1.5-6.9-5.2-4.8 6.9-.7Z"/>
              </svg>
              {rutaCompleta ? 'Beneficio desbloqueado' : 'Beneficio obtenido'}
            </span>
            <p className="actividad-exito-premio-texto">
              {rutaCompleta
                ? conNegrillas(stand.mensajeExito || `**¡Felicidades!**\nYa obtuviste el beneficio de ${stand.nombre}.\n\nCompletaste toda la Ruta Winner.`)
                : conNegrillas(`Ya tienes el beneficio de ${stand.nombre} (${standsCompletados.length}/${STANDS.length}).\n\nCompleta **todos los stands** de la Ruta Winner para descubrir cuál es tu beneficio.`)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={claseMarca} style={estiloMarca}>
      <BotonAtras />

      {paso === 'portada' && (
        <div className="actividad-portada">
          <div className="actividad-portada-marca">
            <span className="actividad-portada-bienvenido">BIENVENIDO A</span>
            <Marca />
          </div>
          <div className="actividad-portada-card-wrap">
            <div className="actividad-portada-card">
              <p className="actividad-portada-texto">
                {conNegrillas(stand.bienvenida || 'Responde las siguientes preguntas y continúa tu recorrido para ganar una **nueva estrella**.')}
              </p>
              <button type="button" className="actividad-btn" onClick={comenzar}>Comenzar</button>
            </div>
          </div>
          <p className="actividad-portada-nota">
            <strong>¡Activa tus beneficios!</strong><br></br>Completa los stands respondiendo las preguntas y <strong>obtén beneficios durante tu recorrido.</strong>
          </p>
        </div>
      )}

      {typeof paso === 'number' && (
        <div className="actividad-pregunta">
          <div className="actividad-progreso-fila">
            <div className="actividad-progreso-label">RESPONDE Y<br/>PARTICIPA</div>
            <div className="actividad-progreso">
              <div className="actividad-progreso-track">
                <div className="actividad-progreso-barra" style={{ width: `${((paso + 1) / preguntas.length) * 100}%` }} />
              </div>
              <span className="actividad-progreso-frac">{paso + 1}/{preguntas.length}</span>
              <svg className="actividad-progreso-estrella" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.5l2.9 6.4 6.9.7-5.2 4.8 1.5 6.9L12 17.9l-6.1 3.4 1.5-6.9-5.2-4.8 6.9-.7Z"/>
              </svg>
            </div>
          </div>

          <div className={`actividad-pregunta-card-wrap ${paso + 1 === preguntas.length ? 'es-ultima' : ''}`}>
            {paso + 1 < preguntas.length && <div className="actividad-pregunta-card-sombra" />}
            <div className="actividad-pregunta-card">
              <div className="actividad-pregunta-marca"><Marca tamano="chico" /></div>
              <h3 className="actividad-pregunta-texto">
                PREGUNTA <span> {paso + 1}</span>
              </h3>
              <p className="actividad-pregunta-enunciado">{preguntas[paso].texto}</p>
              <div className="actividad-opciones">
                {preguntas[paso].opciones.map((opcion, i) => {
                  const marcada = esMultiple ? seleccionMultiple.includes(i) : seleccionada === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`actividad-opcion ${marcada ? 'marcada' : ''}`}
                      onClick={() => alternarOpcion(i)}
                    >
                      <span className="actividad-opcion-letra">{String.fromCharCode(65 + i)}</span>
                      <span className="actividad-opcion-texto">{opcion}</span>
                      <span className="actividad-opcion-radio" />
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className={`actividad-siguiente-btn ${paso + 1 === preguntas.length ? 'final' : ''}`}
                onClick={siguientePregunta}
                disabled={!haySeleccion}
              >
                {paso + 1 === preguntas.length ? 'Enviar respuestas' : 'Siguiente'}
              </button>
            </div>
          </div>


        </div>
      )}

      {paso === 'scanner' && (
        <div className="actividad-scanner">
          <div className="actividad-marca-header scanner"><Marca tamano="mediano" /></div>
          <h3 className="actividad-scanner-titulo">
            VALIDA TU<br /><strong>PARTICIPACIÓN</strong>
          </h3>
          <div className="actividad-scanner-frame">
            <div id="reader-actividad" />
            {/* Sin esquinas propias: html5-qrcode dibuja las suyas al activar
                la cámara y se veían dobles. */}
          </div>
      <p className="actividad-portada-nota">
            Escanea el QR del stand <strong>para validar tu visita</strong> y desbloquear su beneficio
          </p>
          {errorQR && <div className="actividad-scanner-error">{errorQR}</div>}
          {MODO_PRUEBA && (
            <button type="button" className="actividad-btn-prueba" onClick={simularEscaneoQR}>
              (Prueba) Simular escaneo exitoso
            </button>
          )}
        </div>
      )}
    </div>
  );
}
