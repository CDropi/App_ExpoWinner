import { LOGO_APP } from '../../config.js';
import '../../styles/seccion-no-disponible.css';

// Pantalla de espera para los días previos al evento: reemplaza el contenido
// de una pestaña con el aviso de que todavía no está activa.
//
// NO está enganchada a ninguna pestaña. Para activarla, en Ingreso.jsx se
// renderiza en lugar de la vista que corresponda, por ejemplo:
//   {navActive === 2 && (EVENTO_INICIADO ? <MapaView ... /> : <SeccionNoDisponible />)}

export default function SeccionNoDisponible() {
  return (
    <div className="snd">
      <img className="snd-logo" src={LOGO_APP} alt="Logo" />
      <h2 className="snd-title">
        <span className="snd-title-l1">ESTA SECCIÓN</span>
        <span className="snd-title-l2">SE ACTIVARÁ CUANDO</span>
        <span className="snd-title-l3">INICIE EXPO WINNERS</span>
      </h2>
      <div className="snd-icon">
        <img src="/media/Codi.png" alt="" />
      </div>
      <p className="snd-text">
        ¡Te esperamos para vivir<br /><strong>la experiencia completa!</strong>
      </p>
    </div>
  );
}
