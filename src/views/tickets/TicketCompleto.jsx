import { QRCodeSVG } from 'qrcode.react';
import { EVENTO } from '../../config.js';
import '../../styles/tickets.css';

export default function TicketCompleto({ dia, ticket, nombre }) {
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
