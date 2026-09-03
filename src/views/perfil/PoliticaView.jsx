import { useRef, useState } from 'react';
import { LOGO_APP, URL_POLITICA_DATOS } from '../../config.js';
import {
  POLITICA_DATOS, POLITICA_DATOS_TITULO, POLITICA_DATOS_ACTUALIZACION,
} from '../../data/politicaDatos.js';
import { conNegrillas } from '../../utils/texto.jsx';
import BotonRegresar from '../../components/BotonRegresar.jsx';
import '../../styles/politica.css';

export default function PoliticaView({ onRegresar }) {
  // Acordeón: arranca con la primera sección (el preámbulo) abierta, igual
  // que en la web. Guarda el id abierto, no el índice, para que no se
  // desacomode si mañana se reordenan las secciones.
  const [abierta, setAbierta] = useState(POLITICA_DATOS[0]?.id ?? null);

  // Referencia al tope de la pantalla, para el "Volver arriba" de cada sección.
  const topeRef = useRef(null);

  function alternar(id) {
    setAbierta(prev => (prev === id ? null : id));
  }

  function volverArriba() {
    topeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="politica-view" ref={topeRef}>

      {/* Fila superior: regresar a la izquierda y el logo a la derecha, a la
          misma altura. */}
      <div className="politica-barra-superior">
        <BotonRegresar onClick={onRegresar} />
        <img className="politica-logo" src={LOGO_APP} alt="Expo Winners" />
      </div>

      <div className="politica-encabezado">

        <h2 className="politica-titulo">{POLITICA_DATOS_TITULO}</h2>
        {POLITICA_DATOS_ACTUALIZACION && (
          <p className="politica-actualizacion">{POLITICA_DATOS_ACTUALIZACION}</p>
        )}
      </div>

      <div className="politica-acordeon">
        {POLITICA_DATOS.map(seccion => {
          const estaAbierta = abierta === seccion.id;
          return (
            <section
              className={`politica-item ${estaAbierta ? 'politica-item--abierta' : ''}`}
              key={seccion.id}
            >
              <button
                type="button"
                className="politica-item-cabecera"
                onClick={() => alternar(seccion.id)}
                aria-expanded={estaAbierta}
              >
                {/* El punto del preámbulo se dibuja con CSS en vez de con el
                    carácter "•", que queda descentrado dentro del círculo. */}
                <span
                  className={`politica-item-insignia ${
                    seccion.insignia === '•' ? 'politica-item-insignia--punto' : ''
                  }`}
                >
                  {seccion.insignia === '•' ? '' : seccion.insignia}
                </span>
                <span className="politica-item-titulo">
                  {seccion.insignia !== '•' && `${seccion.insignia}. `}
                  {seccion.titulo}
                </span>
                {/* Arrow.svg apunta a la derecha en el archivo: el CSS lo rota
                    hacia abajo (cerrado) o hacia arriba (abierto). */}
                <img className="politica-item-chevron" src="/media/Arrow.svg" alt="" />
              </button>

              {estaAbierta && (
                <div className="politica-item-cuerpo">
                  {seccion.bloques.map((bloque, i) => {
                    if (bloque.tipo === 'subtitulo') {
                      return (
                        <h3 className="politica-subtitulo" key={i}>{bloque.texto}</h3>
                      );
                    }
                    if (bloque.tipo === 'lista') {
                      return (
                        <ul className="politica-lista" key={i}>
                          {bloque.items.map((item, j) => (
                            <li key={j}>
                              {item.termino && (
                                <strong className="politica-lista-termino">
                                  {item.termino}:
                                </strong>
                              )}{' '}
                              {conNegrillas(item.texto)}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p className="politica-parrafo" key={i}>{conNegrillas(bloque.texto)}</p>
                    );
                  })}

                  <button
                    type="button"
                    className="politica-volver-arriba"
                    onClick={volverArriba}
                  >
                    ↑ Volver arriba
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Respaldo: la versión oficial siempre vive en dropi.co, así que si el
          texto de la app quedara desactualizado se puede verificar allá. */}
      <a
        className="politica-enlace-oficial"
        href={URL_POLITICA_DATOS}
        target="_blank"
        rel="noopener noreferrer"
      >
        Ver la versión oficial en dropi.co
      </a>
    </div>
  );
}
