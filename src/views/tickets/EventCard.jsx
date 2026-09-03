import { useState } from 'react';
import { EVENTO } from '../../config.js';
import '../../styles/tickets.css';

export default function EventCard({ dia, ticket, modo, onElegir, onAbrir }) {
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
