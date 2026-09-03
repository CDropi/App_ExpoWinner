import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MODO_PRUEBA, LOGO_APP, IMAGEN_MAPA_PLANO, STANDS, PUNTO_ACADEMY } from '../../config.js';
import { textoSobre } from '../../utils/color.js';
import '../../styles/mapa.css';

export default function MapaView({ onIniciar, standsCompletados, premios, onAbrirPremios, onAbrirAcademy, onSimularCompletarTodos, onSimularReiniciar }) {
  const [pinAbierto, setPinAbierto] = useState(null); // id del stand con el tooltip abierto, o null
  const [trofeoAbierto, setTrofeoAbierto] = useState(false);

  // Cuánto hay que correr el popup en horizontal para que no se salga del
  // plano. 0 = centrado sobre el pin (el caso normal). Solo se usa en los
  // stands que están muy pegados al borde, como ATOM (x:9) o Chatea (x:91).
  const [corrimiento, setCorrimiento] = useState(0);
  const tooltipRef = useRef(null);

  function alternarPin(stand) {
    setPinAbierto(actual => (actual === stand.id ? null : stand.id));
  }

  const standAbierto = STANDS.find(s => s.id === pinAbierto) || null;
  // El punto de Academy comparte el mismo estado `pinAbierto` (así solo puede
  // haber un popup abierto a la vez y el cierre al tocar fuera funciona
  // igual), pero no es un stand: no está en STANDS ni cuenta para el avance.
  const academyAbierto = pinAbierto === PUNTO_ACADEMY.id;
  const todosCompletados = standsCompletados.length === STANDS.length;

  // El panel del trofeo separa los stands en dos grupos. Se calculan a partir
  // de STANDS (y no reordenando el array original) para que el orden dentro de
  // cada grupo siga siendo el mismo que en config.js.
  const standsBloqueados = STANDS.filter(s => !standsCompletados.includes(s.id));
  const standsDesbloqueados = STANDS.filter(s => standsCompletados.includes(s.id));

  // Fila de un stand dentro del panel: isotipo de la marca a la izquierda,
  // nombre y estado a la derecha. Cuando está bloqueado el isotipo se atenúa
  // en escala de grises y se le pone el candado encima; al pre-desbloquearse
  // el candado desaparece y el isotipo se ve completo y a todo color.
  const ItemStand = ({ stand, hecho }) => (
    <div className={`trofeo-item ${hecho ? 'hecho' : ''}`}>
      <div className="trofeo-item-marca">
        {stand.isotipo
          ? <img className="trofeo-item-isotipo" src={stand.isotipo} alt="" />
          : <span className="trofeo-item-inicial">{stand.nombre.charAt(0)}</span>}
        {!hecho && (
          <span className="trofeo-item-candado" aria-hidden="true">
            <img src="/media/Candado.svg" alt="" />
          </span>
        )}
      </div>
      <span className="trofeo-item-nombre">{stand.nombre}</span>
      <span className="trofeo-item-estado">{hecho ? 'Pre-desbloqueado' : 'Bloqueado'}</span>
    </div>
  );

  // Cierra el popup al tocar cualquier parte de la pantalla que no sea un
  // pin ni el popup mismo (el mapa, el encabezado, el nav de abajo, etc.).
  // Se usa 'pointerdown' en el documento y no una capa invisible porque la
  // capa tapaba el nav inferior mientras el popup estuviera abierto.
  // 'pointerdown' se dispara antes que el onClick del pin, así que al pasar
  // de un pin a otro el toque se ignora aquí y lo maneja el propio pin.
  useEffect(() => {
    if (!pinAbierto) return;

    function alTocarFuera(e) {
      if (!(e.target instanceof Element)) return;
      if (e.target.closest('.mapa-pin, .mapa-tooltip')) return;
      setPinAbierto(null);
    }

    document.addEventListener('pointerdown', alTocarFuera);
    return () => document.removeEventListener('pointerdown', alTocarFuera);
  }, [pinAbierto]);

  // Se mide con useLayoutEffect (no useEffect) para que el corrimiento se
  // aplique ANTES de que el navegador pinte: así el popup no aparece
  // primero cortado y luego salta a su lugar.
  // Se usan offsetWidth/clientWidth y no getBoundingClientRect porque el
  // popup entra con una animación de scale, y el rect daría el ancho
  // reducido de la animación en curso.
  useLayoutEffect(() => {
    if (!standAbierto || !tooltipRef.current) {
      setCorrimiento(0);
      return;
    }
    const MARGEN = 10; // aire mínimo entre el popup y el borde del plano
    const popup = tooltipRef.current;
    const plano = popup.parentElement;
    const anchoPlano = plano.clientWidth;
    const anchoPopup = popup.offsetWidth;

    // Si el popup no cabe ni con márgenes, se centra en el plano y ya.
    if (anchoPopup + MARGEN * 2 >= anchoPlano) {
      setCorrimiento(anchoPlano / 2 - (standAbierto.x / 100) * anchoPlano);
      return;
    }

    const centroSobrePin = (standAbierto.x / 100) * anchoPlano;
    const centroMinimo = anchoPopup / 2 + MARGEN;
    const centroMaximo = anchoPlano - anchoPopup / 2 - MARGEN;
    const centroFinal = Math.min(Math.max(centroSobrePin, centroMinimo), centroMaximo);
    setCorrimiento(centroFinal - centroSobrePin);
  }, [standAbierto]);

  return (
    <div className="mapa-view">
      <div className="mapa-plano-wrap">
        {/* La capa que cerraba el tooltip se reemplazó por un listener de
            'pointerdown' en el documento (ver arriba): siendo position:fixed
            inset:0, bloqueaba el nav de abajo mientras el popup estuviera
            abierto. */}

        <div
          className="mapa-plano"
          style={IMAGEN_MAPA_PLANO ? { backgroundImage: `url("${IMAGEN_MAPA_PLANO}")` } : undefined}
        >
          {/* Capas de stands encendidos. Cada una es el plano completo
              (1080x1920) con un solo stand pintado en el color de su marca y
              el resto transparente, así que se superpone al plano base con
              las mismas reglas de tamaño y posición y calza exacto en
              cualquier pantalla.
              Solo se monta la del stand completado: así no se descargan las
              7 imágenes de entrada, que en el wifi del evento importa.
              Un stand sin `imagenMapaCompletado` simplemente no enciende, no
              se rompe nada. */}
          {STANDS.filter(
            stand => stand.imagenMapaCompletado && standsCompletados.includes(stand.id)
          ).map(stand => (
            <div
              key={`encendido-${stand.id}`}
              className="mapa-stand-encendido"
              style={{ backgroundImage: `url("${stand.imagenMapaCompletado}")` }}
              aria-hidden="true"
            />
          ))}
          {/* Encabezado del mapa: título + texto de apoyo. Van juntos en un
              contenedor para que el texto quede siempre pegado debajo del
              título, sin depender de un "top" calculado a mano. */}
          <div className="mapa-encabezado">
            <h2 className="mapa-titulo">Ruta <strong>Winners</strong></h2>
            <p className="mapa-texto">
              Explora el mapa de Expowinners y visita las marcas participantes.
            </p>
          </div>
          <img className="mapa-logo" src={LOGO_APP} alt="Expo Winners" />
          <button type="button" className="mapa-trofeo-btn" aria-label="Ver progreso" onClick={() => setTrofeoAbierto(true)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 4h10v4.2c0 2.87-2.24 5.2-5 5.2s-5-2.33-5-5.2V4Z" fill="#fff"/>
              <path d="M7 5H4.5A1.5 1.5 0 0 0 3 6.5v.75C3 9.55 4.68 11 6.75 11H7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M17 5h2.5A1.5 1.5 0 0 1 21 6.5v.75C21 9.55 19.32 11 17.25 11H17" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M12 13.4v3.1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M8.3 20h7.4c.3-1.2-.4-2.2-1.6-2.4a12 12 0 0 0-4.2 0c-1.2.2-1.9 1.2-1.6 2.4Z" fill="#fff"/>
            </svg>
            {standsCompletados.length > 0 && (
              <span className="mapa-trofeo-badge">{standsCompletados.length}</span>
            )}
          </button>

          {!IMAGEN_MAPA_PLANO && (
            <div className="mapa-plano-placeholder">Plano en diseño — próximamente</div>
          )}

          {STANDS.map(stand => (
            <button
              key={stand.id}
              type="button"
              className={`mapa-pin ${pinAbierto === stand.id ? 'active' : ''} ${standsCompletados.includes(stand.id) ? 'done' : ''}`}
              style={{
                left: `${stand.x}%`,
                top: `${stand.y}%`,
                // El punto vuelve a ser naranja para todas las marcas, así
                // que el pin ya no necesita recibir --stand-color.
                // '--stand-color': stand.colorPrimario,
              }}
              onClick={() => alternarPin(stand)}
              aria-label={stand.nombre}
            >
              <span className="mapa-pin-dot" />
            </button>
          ))}

          {/* Punto de Academy. Va después del map de los stands para que quede
              por encima si alguna vez se solapan, y usa las mismas clases
              base (.mapa-pin / .mapa-tooltip) más un modificador, para que el
              cierre al tocar fuera lo siga reconociendo sin tocar nada. */}
          <button
            type="button"
            className={`mapa-pin mapa-pin--academy ${academyAbierto ? 'active' : ''}`}
            style={{ left: `${PUNTO_ACADEMY.x}%`, top: `${PUNTO_ACADEMY.y}%` }}
            onClick={() => setPinAbierto(actual => (actual === PUNTO_ACADEMY.id ? null : PUNTO_ACADEMY.id))}
            aria-label={PUNTO_ACADEMY.nombre}
          >
            <span className="mapa-pin-academy-dot">
              <img src="/media/Estrella_Blanca.svg" alt="" />
            </span>
          </button>

          {academyAbierto && (
            <div
              className="mapa-tooltip mapa-tooltip--academy"
              style={{ left: `${PUNTO_ACADEMY.x}%`, top: `${PUNTO_ACADEMY.y}%` }}
            >
              {PUNTO_ACADEMY.kicker && (
                <span className="mapa-tooltip-kicker">{PUNTO_ACADEMY.kicker}</span>
              )}
              <div className="mapa-tooltip-titulo">
                {PUNTO_ACADEMY.logo
                  ? <img className="mapa-tooltip-logo" src={PUNTO_ACADEMY.logo} alt={PUNTO_ACADEMY.nombre} />
                  : <span>{PUNTO_ACADEMY.nombre}</span>}
              </div>
              {PUNTO_ACADEMY.descripcion && (
                <p className="mapa-tooltip-desc">{PUNTO_ACADEMY.descripcion}</p>
              )}

              <button
                type="button"
                className="mapa-tooltip-btn mapa-tooltip-btn--academy"
                onClick={onAbrirAcademy}
              >
                {PUNTO_ACADEMY.textoBoton}
              </button>
            </div>
          )}

          {standAbierto && (
            <div
              className="mapa-tooltip"
              ref={tooltipRef}
              style={{
                left: `${standAbierto.x}%`,
                top: `${standAbierto.y}%`,
                // Corrimiento horizontal para que no se salga del plano.
                '--corrimiento': `${corrimiento}px`,
                // El botón del popup usa el color de la marca, y las letras
                // se calculan solas (blancas o negras) según qué tan oscuro
                // sea ese color. Misma lógica que en las pantallas de stand.
                '--stand-color': standAbierto.colorPrimario,
                '--stand-texto': textoSobre(standAbierto.colorPrimario),
              }}
            >
              <div className="mapa-tooltip-titulo">
                {standAbierto.logo
                  ? <img className="mapa-tooltip-logo" src={standAbierto.logo} alt={standAbierto.nombre} />
                  : <span>{standAbierto.nombre}</span>}
              </div>
              <button type="button" className="mapa-tooltip-btn" onClick={() => onIniciar(standAbierto)}>
                {standsCompletados.includes(standAbierto.id) ? 'Completado ✓' : 'Iniciar'}
              </button>
            </div>
          )}

          {/* Botón de premios, debajo de los stands. Queda deshabilitado
              hasta completar los 7; el contador se muestra solo mientras
              está bloqueado, para que se entienda por qué todavía no se
              puede tocar. */}
          <button
            type="button"
            className="mapa-reclamar"
            disabled={!todosCompletados}
            onClick={onAbrirPremios}
          >
            <span>{premios.confirmado ? 'Ver mis premios' : 'Reclamar premios'}</span>
            {!todosCompletados && (
              <span className="mapa-reclamar-contador">
                {standsCompletados.length}/{STANDS.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {trofeoAbierto && (
        <div className="trofeo-overlay" onClick={e => { if (e.target === e.currentTarget) setTrofeoAbierto(false); }}>
          <div className="trofeo-panel">
            <div className="trofeo-panel-header">
              <h3 className="trofeo-panel-titulo">Ruta <strong>Winners</strong></h3>
              <button type="button" className="trofeo-panel-cerrar" onClick={() => setTrofeoAbierto(false)} aria-label="Cerrar">✕</button>
            </div>
            <p className="trofeo-panel-progreso">
              {standsCompletados.length} de {STANDS.length} stands completados
            </p>


            {/* Lista agrupada: primero lo que falta (bloqueados) y debajo lo
                ya conseguido (pre-desbloqueados), con el isotipo de cada marca
                como identidad visual. Si un grupo queda vacío su encabezado no
                se renderiza, así que al completar los 7 stands el panel
                muestra solo la sección de pre-desbloqueados. */}
            <div className="trofeo-lista">
              {standsBloqueados.length > 0 && (
                <div className="trofeo-grupo">
                  <div className="trofeo-grupo-titulo">
                    Bloqueados
                    <span className="trofeo-grupo-contador">{standsBloqueados.length}</span>
                  </div>
                  {standsBloqueados.map(stand => (
                    <ItemStand key={stand.id} stand={stand} hecho={false} />
                  ))}
                </div>
              )}

              {standsDesbloqueados.length > 0 && (
                <div className="trofeo-grupo">
                  <div className="trofeo-grupo-titulo">
                    Pre-desbloqueados
                    <span className="trofeo-grupo-contador hecho">{standsDesbloqueados.length}</span>
                  </div>
                  {standsDesbloqueados.map(stand => (
                    <ItemStand key={stand.id} stand={stand} hecho />
                  ))}
                </div>
              )}
            </div>
            <p className="trofeo-panel-nota">
              {todosCompletados
                ? (premios.confirmado
                    ? 'Ya confirmaste tu selección de premios.'
                    : '¡Completaste toda la ruta! Ya puedes elegir tus premios.')
                : 'Los beneficios se desbloquean por completo cuando termines los 7 stands.'}
            </p>
            {todosCompletados && (
              <button
                type="button"
                className="actividad-btn trofeo-panel-cta"
                onClick={() => { setTrofeoAbierto(false); onAbrirPremios(); }}
              >
                {premios.confirmado ? 'Ver mis premios' : 'Elegir mis premios'}
              </button>
            )}

            {MODO_PRUEBA && (
              <div className="trofeo-panel-test">
                <div className="trofeo-panel-test-label">🧪 Solo modo prueba (no toca Firebase)</div>
                {!todosCompletados && (
                  <button type="button" className="trofeo-panel-test-btn" onClick={onSimularCompletarTodos}>
                    Completar los 7 stands
                  </button>
                )}
                <button type="button" className="trofeo-panel-test-btn secundario" onClick={onSimularReiniciar}>
                  Reiniciar progreso de prueba
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
