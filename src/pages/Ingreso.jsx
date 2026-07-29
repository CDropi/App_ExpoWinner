import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  EVENTO, MODO_PRUEBA, VIDEO_INTRO, IMAGEN_INTRO,
  IMAGEN_POPUP_PROMO, IMAGEN_FONDO_LOGIN, LOGO_LOGIN, LOGO_APP, URL_REGISTRO_LANDING
} from '../config.js';
import { buscarPersonaPorId, obtenerTicketsDePersona, elegirDia } from '../dataLayer.js';
import { useEsMobil } from '../useEsMobil.js';
import SoloMobil from '../SoloMobil.jsx';
import '../styles/ingreso.css';

const TEST_IDS = ["3001234567", "3007654321", "3012223344", "3019998877", "3005556677"];

const NAV_ITEMS = [
  { key: 'tickets', label: 'Tickets', icon: <IconTicket /> },
  { key: 'perfil', label: 'Perfil', icon: <IconUser /> },
  { key: 'mapa', label: 'Mapa', icon: <IconMap /> },
];

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
  const navHoleX = `${navActive * 50}%`;

  const videoRef = useRef(null);

  // ---- Fondo de la pantalla (solo la imagen) ----
  useEffect(() => {
    document.body.style.backgroundImage = `url("${IMAGEN_FONDO_LOGIN}")`;
    return () => { document.body.style.backgroundImage = ''; };
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

        {persona && (
          <div className="app-shell">
            <div className="app-scroll">
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

              {(navActive === 1 || navActive === 2) && <SeccionNoDisponible />}
            </div>

            <div className="nav-wrapper">
              <nav
                className="bottom-nav"
                style={{ '--nav-hole-x': navHoleX }}
              >
                <div className="nav-items-row">
                  {NAV_ITEMS.map((item, i) => (
                    <button
                      key={item.key}
                      type="button"
                      className={`nav-item ${i === navActive ? 'active' : ''}`}
                      aria-label={item.label}
                      onClick={() => setNavActive(i)}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </nav>
              <div className="nav-indicator" style={{ transform: `translateX(${navActive * 100}%)` }}>
                <div className="nav-indicator-circle">{NAV_ITEMS[navActive].icon}</div>
              </div>
            </div>
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

function SeccionNoDisponible() {
  return (
    <div className="snd">
      <img className="snd-logo" src={LOGO_APP} alt="Logo" />
      <h2 className="snd-title">
        <span className="snd-title-l1">SECCIÓN</span>
        <span className="snd-title-l2">TEMPORALMENTE</span>
        <span className="snd-title-l3">NO DISPONIBLE</span>
      </h2>
      <div className="snd-icon">
        <IconEnConstruccion />
      </div>
      <p className="snd-text">
        Esta sección se activará cuando<br /><strong>inicie {EVENTO.nombre}.</strong>
      </p>
      <p className="snd-text">
        ¡Te esperamos para vivir<br /><strong>la experiencia completa!</strong>
      </p>
    </div>
  );
}

function IconEnConstruccion() {
  return <img src="/media/Icono_Construccion.svg" alt="" width="100" height="100" />;
}

function EventCard({ dia, ticket, modo, onElegir, onAbrir }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const partesFecha = dia.fecha.split(' '); // ["25", "JUL"]
  const yaElegida = modo === 'proximo' && !!ticket;

  async function handleElegir() {
    setCargando(true);
    setError('');
    try {
      await onElegir();
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al generar tu entrada. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className={`event-card ${yaElegida ? 'ya-elegida' : ''}`}>
      <div className="event-card-row-top">
        <div className="event-card-media-wrap">
          <img
            className="event-card-media"
            src={dia.imagen}
            alt={`${EVENTO.nombre} — ${dia.etiqueta}`}
            onError={e => { e.target.style.background = 'var(--bg)'; e.target.removeAttribute('src'); }}
          />
          <div className="event-card-tag">{dia.etiqueta}</div>
        </div>
        <div className="event-card-datebox">
          <div className="day">{partesFecha[0]}</div>
          <div className="month">{partesFecha[1]}</div>
          <div className="year">{EVENTO.anio}</div>
        </div>
      </div>

      <div className="event-card-row-bottom">
        <div className="event-card-namevenue">
          <div className="event-card-title">{EVENTO.nombre}</div>
          <div className="event-card-venue">{EVENTO.lugar}, {EVENTO.ciudad}</div>
        </div>

        <div className="event-card-action">
          {modo === 'proximo' && !ticket && (
            <button type="button" className="event-card-cta" disabled={cargando} onClick={handleElegir}>
              {cargando ? 'Generando...' : 'Adquirir Entrada'}
            </button>
          )}
          {modo === 'proximo' && ticket && (
            <div className="event-card-status">{ticket.checkedIn ? 'Ingreso registrado' : 'Adquirida'}</div>
          )}
          {modo === 'entrada' && (
            <div
              className={`event-card-status ${ticket.checkedIn ? 'used' : 'valid clickable'}`}
              onClick={ticket.checkedIn ? undefined : onAbrir}
            >
              {ticket.checkedIn ? 'Ingreso registrado' : 'Ver mi QR'}
            </div>
          )}
        </div>
      </div>

      {error && <div className="event-card-cta-error">{error}</div>}
    </div>
  );
}

function IconTicket() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" />
      <path d="M13 5v14" strokeDasharray="2 3" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}
function IconMap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function TicketCompleto({ dia, ticket, nombre }) {
  const partesFecha = dia.fecha.split(' ');
  return (
    <div className="ticket">
      <div className="t-top">
        <div className="t-brand">
          <div className="name">{EVENTO.nombre}</div>
          <div className={`status-chip ${ticket.checkedIn ? 'used' : 'valid'}`}>
            {ticket.checkedIn ? 'INGRESO REGISTRADO' : 'VÁLIDA'}
          </div>
        </div>
        <div className="t-datebox">
          <div>
            <div className="date-num">{partesFecha[0]}</div>
            <div className="date-sub">{partesFecha.slice(1).join(' ')} · {dia.hora}</div>
          </div>
          <div className="divider" />
          <div>
            <div className="venue">{dia.etiqueta}</div>
            <div className="venue-sub">{EVENTO.lugar} · {EVENTO.ciudad}</div>
          </div>
        </div>
      </div>
      <div className="perforation"><div className="notch left" /><div className="notch right" /></div>
      <div className="t-bottom">
        <div className="attendee-name">{nombre}</div>
        <div className="qr-holder">
          <QRCodeSVG value={ticket.ticketCode} size={168} fgColor="#10131C" bgColor="#ffffff" level="M" />
        </div>
        <div className="ticket-code">{ticket.ticketCode}</div>
      </div>
    </div>
  );
}
