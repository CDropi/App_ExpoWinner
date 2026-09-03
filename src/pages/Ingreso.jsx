import { useEffect, useRef, useState } from 'react';
import {
  EVENTO, MODO_PRUEBA, VIDEO_INTRO, IMAGEN_INTRO, IMAGEN_POPUP_PROMO,
  IMAGEN_FONDO_LOGIN, IMAGEN_FONDO_PERFIL, LOGO_LOGIN, LOGO_APP,
  URL_REGISTRO_LANDING, STANDS,
} from '../config.js';
import {
  buscarPersonaPorId, obtenerTicketsDePersona, elegirDia,
  obtenerStandsCompletados, marcarStandCompletado,
  obtenerPremiosPersona, confirmarPremios, reiniciarDatosDePrueba,
} from '../lib/dataLayer.js';
import { useEsMobil } from '../hooks/useEsMobil.js';
import SoloMobil from '../components/SoloMobil.jsx';
import BottomNav from '../components/BottomNav.jsx';
import EventCard from '../views/tickets/EventCard.jsx';
import TicketCompleto from '../views/tickets/TicketCompleto.jsx';
import MapaView from '../views/ruta/MapaView.jsx';
import ActividadStand from '../views/ruta/ActividadStand.jsx';
import PremiosView from '../views/ruta/PremiosView.jsx';
import PerfilView from '../views/perfil/PerfilView.jsx';
import PoliticaView from '../views/perfil/PoliticaView.jsx';
import AcademyView from '../views/academy/AcademyView.jsx';
import '../styles/ingreso.css';

// Números de prueba que aparecen como atajo en el login cuando
// MODO_PRUEBA está activo en config.js.
const TEST_IDS = ["3001234567", "3007654321", "3012223344", "3019998877", "3005556677"];

export default function Ingreso() {
  const esMobil = useEsMobil();
  const [introDone, setIntroDone] = useState(false);
  const [docValue, setDocValue] = useState('');
  const [errorHtml, setErrorHtml] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [persona, setPersona] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [tab, setTab] = useState('proximos');
  const [promoOpen, setPromoOpen] = useState(false);
  const [ticketModal, setTicketModal] = useState(null); // { dia, ticket } | null
  const [navActive, setNavActive] = useState(0);
  const [standActivo, setStandActivo] = useState(null); // stand elegido en el mapa (o null si estamos en el mapa)
  const [standsCompletados, setStandsCompletados] = useState([]); // ids de stands ya "pre-desbloqueados"
  const [premios, setPremios] = useState({ seleccionados: [], confirmado: false, entregados: [] });
  const [premiosAbierto, setPremiosAbierto] = useState(false); // pantalla de elegir/ver premios
  const [politicaAbierta, setPoliticaAbierta] = useState(false); // pantalla de política de datos
  const [academyAbierto, setAcademyAbierto] = useState(false); // mini experiencia de Academy

  const videoRef = useRef(null);

  // ---- Fondo de la pantalla (solo la imagen) ----
  // La pantalla de Perfil (tab 1) usa su propia imagen de fondo; todas las
  // demás vistas (login, tickets, mapa, actividad de stand, premios) siguen
  // usando el fondo general de la app.
  const enPerfil = !!persona && !standActivo && !premiosAbierto && !politicaAbierta && !academyAbierto && navActive === 1;
  useEffect(() => {
    // Versión anterior (un solo fondo para toda la pantalla de ingreso):
    // document.body.style.backgroundImage = `url("${IMAGEN_FONDO_LOGIN}")`;
    const imagenFondo = enPerfil ? IMAGEN_FONDO_PERFIL : IMAGEN_FONDO_LOGIN;
    document.body.style.backgroundImage = `url("${imagenFondo}")`;
    return () => { document.body.style.backgroundImage = ''; };
  }, [enPerfil]);

  // Precarga del fondo de Perfil para que al entrar al tab el cambio sea
  // inmediato y no se vea el body sin imagen mientras descarga.
  useEffect(() => {
    const img = new Image();
    img.src = IMAGEN_FONDO_PERFIL;
  }, []);

  // ---- Cortinilla de video ----
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const terminar = () => setIntroDone(true);
    v.addEventListener('ended', terminar);
    v.addEventListener('error', terminar);
    v.play().catch(terminar);
    return () => {
      v.removeEventListener('ended', terminar);
      v.removeEventListener('error', terminar);
    };
  }, []);

  // ---- Escape cierra cualquier modal abierto ----
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        cerrarTicketModal();
        setPromoOpen(false);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [persona]);

  if (!esMobil) return <SoloMobil />;

  async function buscarEntrada(idOverride) {
    const idValue = (idOverride ?? docValue).trim();
    setErrorHtml('');
    if (!idValue) {
      setErrorHtml('Por favor <strong>ingresa tu número de celular</strong>.');
      return;
    }
    setBuscando(true);
    try {
      const personaEncontrada = await buscarPersonaPorId(idValue);
      if (!personaEncontrada) {
        setErrorHtml('Este número no se encuentra <strong>registrado</strong>.<br>Verifica el número o contacta a soporte.');
        return;
      }
      const misTickets = await obtenerTicketsDePersona(idValue);
      setPersona(personaEncontrada);
      setTickets(misTickets);
      setTab('proximos');
      obtenerStandsCompletados(idValue).then(setStandsCompletados).catch(() => {});
      obtenerPremiosPersona(idValue).then(setPremios).catch(() => {});
      // [TEMPORAL - oculto para la primera versión de prueba, no borrar]
      setPromoOpen(true);
    } catch (err) {
      console.error(err);
      setErrorHtml('Ocurrió un error al buscar tu registro. Intenta de nuevo.');
    } finally {
      setBuscando(false);
    }
  }

  async function handleElegirDia(dia) {
    const nuevoTicket = await elegirDia(persona.id, persona.nombre, dia.id);
    setTickets(prev => [...prev, nuevoTicket]);
    setTab('misEntradas');
  }

  // Se llama quien ya escaneó el QR correcto de un stand. Actualiza el
  // progreso local (para el mapa y el trofeo) sin tener que recargar todo.
  function manejarStandCompletado(standId) {
    setStandsCompletados(prev => (prev.includes(standId) ? prev : [...prev, standId]));
  }

  // Confirma la selección de premios de forma DEFINITIVA (no se puede
  // deshacer ni volver a llamar una vez que ya quedó confirmada).
  async function manejarConfirmarPremios(idsSeleccionados) {
    const actualizado = await confirmarPremios(persona.id, idsSeleccionados);
    setPremios(actualizado);
  }

  // "Empezar misión" ahora lo maneja AcademyView por dentro (pasa de la
  // pantalla de bienvenida a la del camino), así que este handler ya no se
  // usa. Se deja comentado por si vuelve a hacer falta desde afuera:
  // function manejarEmpezarMision() {
  //   // Aquí irá el arranque de la misión.
  // }

  // ---- SOLO MODO_PRUEBA: para poder ver el flujo de premios completo sin
  // tener que escanear los 7 QR reales uno por uno. No toca Firebase; en
  // modo prueba todo vive en localStorage (ver dataLayer.js).
  async function simularCompletarTodosLosStands() {
    if (!MODO_PRUEBA || !persona) return;
    for (const stand of STANDS) {
      await marcarStandCompletado(persona.id, stand.id);
    }
    setStandsCompletados(await obtenerStandsCompletados(persona.id));
  }

  async function simularReiniciarProgreso() {
    if (!MODO_PRUEBA || !persona) return;
    reiniciarDatosDePrueba();
    const [misTickets, standsFrescos, premiosFrescos] = await Promise.all([
      obtenerTicketsDePersona(persona.id),
      obtenerStandsCompletados(persona.id),
      obtenerPremiosPersona(persona.id),
    ]);
    setTickets(misTickets);
    setStandsCompletados(standsFrescos);
    setPremios(premiosFrescos);
  }

  // Vuelve a consultar Firestore antes de mostrar "Mis entradas", para que
  // se refleje de inmediato si el staff ya escaneó alguna entrada (los
  // tickets solo se cargaban una vez, al iniciar sesión, y no se
  // actualizaban solos).
  async function abrirMisEntradas() {
    setTab('misEntradas');
    try {
      const misTickets = await obtenerTicketsDePersona(persona.id);
      setTickets(misTickets);
    } catch (err) {
      console.error(err);
    }
  }

  // Antes de abrir el modal con el QR, confirma el estado más reciente del
  // ticket (por si el staff lo escaneó justo antes de que la persona lo tocara).
  async function abrirTicket(dia, ticketPrevio) {
    try {
      const misTickets = await obtenerTicketsDePersona(persona.id);
      setTickets(misTickets);
      const fresco = misTickets.find(t => t.dia === dia.id) || ticketPrevio;
      setTicketModal({ dia, ticket: fresco });
    } catch (err) {
      console.error(err);
      setTicketModal({ dia, ticket: ticketPrevio });
    }
  }

  // Cierra el modal del ticket y de paso refresca los tickets — así, si el
  // staff escaneó la entrada mientras la persona tenía el QR abierto, al
  // cerrarlo ya ve el estado correcto sin tener que salir de la pestaña.
  async function cerrarTicketModal() {
    setTicketModal(null);
    if (!persona) return;
    try {
      const misTickets = await obtenerTicketsDePersona(persona.id);
      setTickets(misTickets);
    } catch (err) {
      console.error(err);
    }
  }

  const ticketsPorDia = (diaId) => tickets.find(t => t.dia === diaId);

  return (
    <>
      {!introDone && (
        <div id="introOverlay" style={{ backgroundImage: `url("${IMAGEN_INTRO}")` }}>
          <video ref={videoRef} src={VIDEO_INTRO} muted playsInline autoPlay preload="auto" />
        </div>
      )}

      <div id="mainContent" className={introDone ? 'visible' : ''}>

        {!persona && (
          <div className="login-card" id="loginCard">
            <h1 className="login-title">Bienvenido</h1>
            <img className="login-logo" src={LOGO_LOGIN} alt="Logo" />
            <p className="login-subtitle">Ingresa con <strong>tu número celular</strong></p>
            <label htmlFor="docInput" className="sr-only">Número de celular</label>
            <input
              id="docInput"
              className="login-input"
              inputMode="tel"
              autoComplete="off"
              value={docValue}
              onChange={e => setDocValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') buscarEntrada(); }}
            />
            {errorHtml && <div className="error-msg" style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: errorHtml }} />}
            <button id="btnBuscar" className="login-button" disabled={buscando} onClick={() => buscarEntrada()}>
              {buscando ? <><span className="spinner" />Buscando...</> : 'Ingresar'}
            </button>
            <div className="login-register">
              ¿Aún no tienes una cuenta? <br />
              <a href={URL_REGISTRO_LANDING} target="_blank" rel="noopener noreferrer">Regístrate aquí</a>
            </div>
            {MODO_PRUEBA && (
              <div className="test-ids" style={{ display: 'flex' }}>
                {TEST_IDS.map(id => (
                  <button key={id} type="button" onClick={() => { setDocValue(id); buscarEntrada(id); }}>{id}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {persona && standActivo && (
          <div className="app-shell">
            <div className="app-scroll app-scroll--full">
              <ActividadStand
                key={standActivo.id}
                stand={standActivo}
                persona={persona}
                completado={standsCompletados.includes(standActivo.id)}
                standsCompletados={standsCompletados}
                onCompletar={manejarStandCompletado}
                onRegresar={() => setStandActivo(null)}
              />
            </div>
          </div>
        )}

        {/* Mini experiencia de Academy: pantalla completa, sin el nav de abajo,
            igual que la actividad de un stand. */}
        {persona && !standActivo && academyAbierto && (
          <div className="app-shell">
            <div className="app-scroll app-scroll--full">
              {/* AcademyView maneja por dentro cuál de sus pantallas se ve
                  (bienvenida, camino, ...). Desde aquí solo se le dice cómo
                  salir de la mini experiencia y volver al mapa.
                  Versión anterior, cuando Academy era una sola pantalla:
              <AcademyView
                onRegresar={() => setAcademyAbierto(false)}
                onEmpezar={manejarEmpezarMision}
              />
              */}
              <AcademyView onSalir={() => setAcademyAbierto(false)} />
            </div>
          </div>
        )}

        {persona && !standActivo && !academyAbierto && !premiosAbierto && politicaAbierta && (
          <div className="app-shell">
            <div className="app-scroll">
              <PoliticaView onRegresar={() => setPoliticaAbierta(false)} />
            </div>
          </div>
        )}

        {persona && !standActivo && !academyAbierto && premiosAbierto && (
          <div className="app-shell">
            {/* app-scroll--premios anula el padding inferior: el panel de
                fondo sólido pone su propio respiro y necesita llegar al borde. */}
            <div className="app-scroll app-scroll--premios">
              <PremiosView
                standsCompletados={standsCompletados}
                premios={premios}
                onConfirmar={manejarConfirmarPremios}
                onRegresar={() => setPremiosAbierto(false)}
              />
            </div>
          </div>
        )}

        {persona && !standActivo && !academyAbierto && !premiosAbierto && !politicaAbierta && (
          <div className="app-shell">
            {/* Perfil no scrollea: su contenido está pensado para caber en una
                sola pantalla. */}
            <div
              className={`app-scroll ${navActive === 2 ? 'app-scroll--full' : ''} ${
                navActive === 1 ? 'app-scroll--sin-scroll' : ''
              }`}
            >
              {navActive === 0 && (
                <>
                  <div className="app-header">
                    <img className="app-header-logo" src={LOGO_APP} alt="Logo" />
                    <h1 className="app-greeting">¡Hola <strong>{persona.nombre.split(' ')[0].toUpperCase()}</strong>!</h1>
                    <p className="app-greeting-sub">
                      Selecciona el día al que asistirás. Al <strong>elegir tu entrada</strong>, podrás{' '}
                      <strong>visualizar el código QR</strong> que deberás presentar en el ingreso al evento.
                    </p>
                  </div>

                  <div className="tabs">
                    <button type="button" className={`tab-btn ${tab === 'proximos' ? 'active' : ''}`} onClick={() => setTab('proximos')}>
                      Eventos Próximos
                    </button>
                    <button type="button" className={`tab-btn ${tab === 'misEntradas' ? 'active' : ''}`} onClick={abrirMisEntradas}>
                      Mis entradas
                      {tickets.filter(t => !t.checkedIn).length > 0 && (
                        <span className="tab-badge">{tickets.filter(t => !t.checkedIn).length}</span>
                      )}
                    </button>
                  </div>

                  {tab === 'proximos' && (
                    <div>
                      {EVENTO.dias.map(dia => (
                        <EventCard
                          key={dia.id}
                          dia={dia}
                          ticket={ticketsPorDia(dia.id)}
                          modo="proximo"
                          onElegir={() => handleElegirDia(dia)}
                        />
                      ))}
                    </div>
                  )}

                  {tab === 'misEntradas' && (
                    <div>
                      {EVENTO.dias
                        .map(dia => ({ dia, ticket: ticketsPorDia(dia.id) }))
                        .filter(x => x.ticket)
                        .map(({ dia, ticket }) => (
                          <EventCard
                            key={dia.id}
                            dia={dia}
                            ticket={ticket}
                            modo="entrada"
                            onAbrir={() => abrirTicket(dia, ticket)}
                          />
                        ))}
                      {tickets.length === 0 && (
                        <div className="empty-state" style={{ display: 'block' }}>
                          Aún no has adquirido ninguna entrada.<br />Ve a "Eventos Próximos" para elegir tu día.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {navActive === 1 && (
                <PerfilView
                  persona={persona}
                  standsCompletados={standsCompletados}
                  premios={premios}
                  onAbrirPremios={() => setPremiosAbierto(true)}
                  onAbrirPolitica={() => setPoliticaAbierta(true)}
                />
              )}
              {navActive === 2 && (
                <MapaView
                  onIniciar={setStandActivo}
                  standsCompletados={standsCompletados}
                  premios={premios}
                  onAbrirPremios={() => setPremiosAbierto(true)}
                  onAbrirAcademy={() => setAcademyAbierto(true)}
                  onSimularCompletarTodos={simularCompletarTodosLosStands}
                  onSimularReiniciar={simularReiniciarProgreso}
                />
              )}
            </div>

            <BottomNav activo={navActive} onCambiar={setNavActive} />
          </div>
        )}
      </div>

      {ticketModal && (
        <div className="ticket-modal open" onClick={e => { if (e.target === e.currentTarget) cerrarTicketModal(); }}>
          <div className="ticket-modal-inner">
            <button type="button" className="ticket-modal-close" onClick={cerrarTicketModal}>✕</button>
            <TicketCompleto dia={ticketModal.dia} ticket={ticketModal.ticket} nombre={persona?.nombre} />
          </div>
        </div>
      )}

      {promoOpen && (
        <div className="promo-modal open" onClick={e => { if (e.target === e.currentTarget) setPromoOpen(false); }}>
          <div className="promo-modal-inner">
            <button type="button" className="promo-modal-close" onClick={() => setPromoOpen(false)}>✕</button>
            <img src={IMAGEN_POPUP_PROMO} alt="Promoción" />
          </div>
        </div>
      )}
    </>
  );
}
