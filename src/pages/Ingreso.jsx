import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  EVENTO, MODO_PRUEBA, VIDEO_INTRO, IMAGEN_INTRO,
  IMAGEN_POPUP_PROMO, IMAGEN_FONDO_LOGIN, LOGO_LOGIN, LOGO_APP, URL_REGISTRO_LANDING
} from '../config.js';
import { buscarPersonaPorId, obtenerTicketsDePersona, elegirDia, marcarCuentaCreada } from '../lib/dataLayer.js';
import { existeCuentaParaTelefono, crearContrasenaParaTelefono, iniciarSesionConTelefono } from '../lib/auth.js';
import { useEsMobil } from '../hooks/useEsMobil.js';
import SoloMobil from '../components/SoloMobil.jsx';
import '../styles/ingreso.css';

const TEST_IDS = ["3001234567", "3007654321", "3012223344", "3019998877", "3005556677"];

const NAV_ITEMS = [
  { key: 'tickets', label: 'Tickets', icon: '/media/Tickets.svg', iconActivo: '/media/Tickets_2.svg' },
  { key: 'perfil', label: 'Perfil', icon: '/media/Perfil.svg', iconActivo: '/media/Perfil_2.svg' },
  { key: 'mapa', label: 'Mapa', icon: '/media/Mapa.svg', iconActivo: '/media/Mapa_2.svg' },
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

  // ---- Paso de contraseña (teléfono ya encontrado, falta autenticar) ----
  // 'celular' | 'crearPassword' | 'ingresarPassword'
  const [pasoLogin, setPasoLogin] = useState('celular');
  const [telefonoPendiente, setTelefonoPendiente] = useState('');
  const [personaPendiente, setPersonaPendiente] = useState(null);
  const [passwordValue, setPasswordValue] = useState('');
  const [passwordConfirmValue, setPasswordConfirmValue] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const videoRef = useRef(null);

  // ---- Fondo de la pantalla (solo la imagen) ----
  useEffect(() => {
    document.body.style.backgroundImage = `url("${IMAGEN_FONDO_LOGIN}")`;
    return () => { document.body.style.backgroundImage = ''; };
  }, []);

  // [Ya no se usa sesión anónima: ahora el asistente se autentica con
  // teléfono + contraseña real, ver buscarEntrada / handleCrearPassword /
  // handleIngresarPassword más abajo. No borrar por si se necesita revertir.]
  // useEffect(() => {
  //   if (MODO_PRUEBA) return;
  //   asegurarSesionAnonima().catch(err => console.error('Error iniciando sesión anónima:', err));
  // }, []);

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

      if (MODO_PRUEBA) {
        // Modo de prueba: no usa Firebase Auth, se conserva el comportamiento anterior.
        await completarIngreso(idValue, personaEncontrada);
        return;
      }

      // Producción: hay que autenticar con teléfono + contraseña antes de
      // poder leer/escribir en Firestore (regla `request.auth != null`).
      // Se decide "crear" vs "ingresar" contraseña con el flag `tieneCuenta`
      // que guardamos nosotros mismos en el preregistro — no le preguntamos
      // a Firebase Authentication porque esa consulta queda inutilizada si
      // el proyecto tiene activada la protección de enumeración de correos.
      setTelefonoPendiente(idValue);
      setPersonaPendiente(personaEncontrada);
      setPasoLogin(personaEncontrada.tieneCuenta ? 'ingresarPassword' : 'crearPassword');
    } catch (err) {
      console.error(err);
      setErrorHtml('Ocurrió un error al buscar tu registro. Intenta de nuevo.');
    } finally {
      setBuscando(false);
    }
  }

  // Carga los tickets y entra a la app. Se llama tanto en modo prueba (justo
  // después de encontrar a la persona) como en producción (justo después de
  // que la contraseña quedó validada/creada).
  async function completarIngreso(idValue, personaEncontrada) {
    const misTickets = await obtenerTicketsDePersona(idValue);
    setPersona(personaEncontrada);
    setTickets(misTickets);
    setTab('proximos');
    // [TEMPORAL - oculto para la primera versión de prueba, no borrar]
    setPromoOpen(true);
  }

  function volverAlCelular() {
    setPasoLogin('celular');
    setTelefonoPendiente('');
    setPersonaPendiente(null);
    setPasswordValue('');
    setPasswordConfirmValue('');
    setPasswordError('');
  }

  // Primera vez que este teléfono entra: crea su contraseña.
  async function handleCrearPassword() {
    setPasswordError('');
    if (passwordValue.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (passwordValue !== passwordConfirmValue) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }
    setBuscando(true);
    try {
      await crearContrasenaParaTelefono(telefonoPendiente, passwordValue);
      await marcarCuentaCreada(telefonoPendiente);
      await completarIngreso(telefonoPendiente, personaPendiente);
      volverAlCelular();
    } catch (err) {
      // Cuentas creadas ANTES de este cambio (como cuentas de prueba) no
      // tienen el flag `tieneCuenta` en su preregistro todavía, así que
      // caen aquí una sola vez. Marcamos el flag para que la próxima vez
      // ya le salga "Ingresa tu contraseña" directamente, sin pasar por
      // este respaldo.
      if (err?.code === 'auth/email-already-in-use') {
        marcarCuentaCreada(telefonoPendiente);
        setPasswordValue('');
        setPasswordConfirmValue('');
        setPasoLogin('ingresarPassword');
        return;
      }
      console.error(err);
      setPasswordError('No se pudo crear tu contraseña. Intenta de nuevo.');
    } finally {
      setBuscando(false);
    }
  }

  // Ya tenía contraseña creada: valida e ingresa.
  async function handleIngresarPassword() {
    setPasswordError('');
    if (!passwordValue) {
      setPasswordError('Ingresa tu contraseña.');
      return;
    }
    setBuscando(true);
    try {
      await iniciarSesionConTelefono(telefonoPendiente, passwordValue);
      if (!personaPendiente?.tieneCuenta) marcarCuentaCreada(telefonoPendiente);
      await completarIngreso(telefonoPendiente, personaPendiente);
      volverAlCelular();
    } catch (err) {
      console.error(err);
      setPasswordError('Contraseña incorrecta. Intenta de nuevo.');
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

        {!persona && pasoLogin === 'celular' && (
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

        {!persona && pasoLogin === 'crearPassword' && (
          <div className="login-card" id="crearPasswordCard">
            <h1 className="login-title">Crea tu contraseña</h1>
            <img className="login-logo" src={LOGO_LOGIN} alt="Logo" />
            <p className="login-subtitle">
              Es la <strong>primera vez</strong> que ingresas con <strong>{telefonoPendiente}</strong>.<br />
              Crea una contraseña para proteger tu cuenta.
            </p>
            <label htmlFor="pwNueva" className="sr-only">Nueva contraseña</label>
            <input
              id="pwNueva"
              type="password"
              className="login-input"
              autoComplete="new-password"
              placeholder="Nueva contraseña"
              value={passwordValue}
              onChange={e => setPasswordValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCrearPassword(); }}
            />
            <label htmlFor="pwConfirmar" className="sr-only">Confirmar contraseña</label>
            <input
              id="pwConfirmar"
              type="password"
              className="login-input"
              autoComplete="new-password"
              placeholder="Confirmar contraseña"
              value={passwordConfirmValue}
              onChange={e => setPasswordConfirmValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCrearPassword(); }}
            />
            {passwordError && <div className="error-msg" style={{ display: 'block' }}>{passwordError}</div>}
            <button className="login-button" disabled={buscando} onClick={handleCrearPassword}>
              {buscando ? <><span className="spinner" />Creando...</> : 'Crear contraseña y continuar'}
            </button>
            <div className="login-register">
              <a href="#" onClick={e => { e.preventDefault(); volverAlCelular(); }}>← Volver</a>
            </div>
          </div>
        )}

        {!persona && pasoLogin === 'ingresarPassword' && (
          <div className="login-card" id="ingresarPasswordCard">
            <h1 className="login-title">Ingresa tu contraseña</h1>
            <img className="login-logo" src={LOGO_LOGIN} alt="Logo" />
            <p className="login-subtitle">Bienvenido de nuevo, <strong>{telefonoPendiente}</strong></p>
            <label htmlFor="pwLogin" className="sr-only">Contraseña</label>
            <input
              id="pwLogin"
              type="password"
              className="login-input"
              autoComplete="current-password"
              placeholder="Contraseña"
              value={passwordValue}
              onChange={e => setPasswordValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleIngresarPassword(); }}
            />
            {passwordError && <div className="error-msg" style={{ display: 'block' }}>{passwordError}</div>}
            <button className="login-button" disabled={buscando} onClick={handleIngresarPassword}>
              {buscando ? <><span className="spinner" />Ingresando...</> : 'Ingresar'}
            </button>
            <div className="login-register">
              <a href="#" onClick={e => { e.preventDefault(); volverAlCelular(); }}>← Volver</a>
            </div>
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
                      <img src={item.icon} alt="" width={24} height={24} />
                    </button>
                  ))}
                </div>
              </nav>
              <div className="nav-indicator" style={{ transform: `translateX(${navActive * 100}%)` }}>
                <div className="nav-indicator-circle">
                  <img src={NAV_ITEMS[navActive].iconActivo} alt="" width={26} height={26} />
                </div>
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
        <span className="snd-title-l1">ESTA SECCIÓN</span>
        <span className="snd-title-l2">SE ACTIVARÁ CUANDO</span>
        <span className="snd-title-l3">INICIE EXPO WINNERS</span> 
      </h2>
      <div className="snd-icon">
        <img src="/media/Codi.png" alt=""/>;
      </div>      
      <p className="snd-text">
        ¡Te esperamos para vivir<br /><strong>la experiencia completa!</strong>
      </p>
    </div>
  );
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
            <div className="date-sub">{partesFecha.slice(1).join(' ')}</div>
          </div>
          <div className="divider" />
          <div>
            <div className="venue">{dia.etiqueta}</div>
            <div className="venue-sub">{EVENTO.lugar} · {EVENTO.ciudad}</div>
          </div>
          <div className="divider" />
          <div className="attendee-name">{nombre}</div>
        </div>
      </div>
      <div className="perforation"><div className="notch left" /><div className="notch right" /></div>
      <div className="t-bottom">        
        <div className="qr-holder">
          <QRCodeSVG value={ticket.ticketCode} size={168} fgColor="#10131C" bgColor="#ffffff" level="M" />
        </div>
        <div className="ticket-code">{ticket.ticketCode}</div>
        <div className="InfoTicket">
          <p><strong>¡Importante!</strong> Presenta este código QR para entrar al evento. Recuerda que tu código es personal e intransferible.</p>
        </div>
      </div>
    </div>
  );
}
