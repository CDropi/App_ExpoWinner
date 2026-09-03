import { LOGO_APP, STANDS } from '../../config.js';
import '../../styles/perfil.css';

export default function PerfilView({ persona, standsCompletados, premios, onAbrirPremios, onAbrirPolitica }) {
  const total = STANDS.length;
  const completo = standsCompletados.length === total;

  // La comunidad viene del documento de "preregistros" (campo "comunidad").
  // Si el registro no la trae, no dibujamos esa línea para no dejar un hueco.
  const comunidad = (persona.comunidad || '').trim();

  return (
    <div className="perfil-view">
      {/* Mismo logo y mismo tamaño/espaciado que en la pestaña de Tickets:
          reutiliza .app-header + .app-header-logo para que no se desfase. */}
      <div className="app-header">
        <img className="app-header-logo" src={LOGO_APP} alt="Logo" />
      </div>

      <div className="perfil-identidad">
        <div className="perfil-identidad-pill">
          <span className="perfil-identidad-icono" aria-hidden="true" />
          <span className="perfil-identidad-nombre">{persona.nombre.toUpperCase()}</span>
        </div>
        {comunidad && (
          <span className="perfil-identidad-comunidad">{comunidad.toUpperCase()}</span>
        )}
      </div>


      <div className="perfil-beneficios">
        {/* Codi va antes del contenido para que quede por debajo del texto si
            algún día se cruzan; su posicionamiento lo maneja el CSS. */}
        <img className="perfil-beneficios-codi" src="/media/Codi_Perfil.png" alt="" />

        {/* Barra de avance: ocupa todo el ancho de la tarjeta porque Codi está
            anclado abajo y su cabeza nunca llega a esta altura. */}
        <div className="perfil-beneficios-avance">
          <div className="perfil-beneficios-avance-fila">
            <img className="perfil-beneficios-avance-estrella" src="/media/Estrella.svg" alt="" />
            <span className="perfil-beneficios-avance-titulo">
              AVANCE <strong>RUTA WINNERS</strong>
            </span>
          </div>
          <div className="perfil-beneficios-avance-track">
            <div
              className="perfil-beneficios-avance-barra"
              style={{ width: `${(standsCompletados.length / total) * 100}%` }}
            />
          </div>
          <span className="perfil-beneficios-progreso">
            {premios.confirmado
              ? 'Ya confirmaste tu selección'
              : completo
                ? '¡Ya puedes elegir tus premios!'
                : `${standsCompletados.length} de ${total} stands completados`}
          </span>
        </div>

        <div className="perfil-beneficios-contenido">
          <h2 className="perfil-beneficios-titulo">
            Tus beneficios <strong>te esperan</strong>
          </h2>
          <p className="perfil-beneficios-texto">
            Cada stand completado te acerca a más recompensas. Al final de tu Ruta Winner
            puedes ver y reclamar todos los beneficios que desbloqueaste.
          </p>
          {/* Bloqueado hasta completar los 7 stands. El texto de arriba
              ("x de 7 stands completados") ya explica por qué. */}
          <button
            type="button"
            className="perfil-beneficios-btn"
            disabled={!completo}
            onClick={onAbrirPremios}
          >
            REDIMIR <strong>BENEFICIOS</strong>
            <img className="perfil-beneficios-btn-flecha" src="/media/Arrow.svg" alt="" />
          </button>
        </div>
      </div>


      <button type="button" className="perfil-politica" onClick={onAbrirPolitica}>
        <img className="perfil-politica-icono" src="/media/Politica.svg" alt="" />
        <span className="perfil-politica-texto">
          <span className="perfil-politica-titulo">Política de tratamiento de datos</span>
          <span className="perfil-politica-sub">Consulta cómo protegemos tu información</span>
        </span>
        <img className="perfil-politica-flecha" src="/media/Arrow.svg" alt="" />
      </button>
    </div>
  );
}
