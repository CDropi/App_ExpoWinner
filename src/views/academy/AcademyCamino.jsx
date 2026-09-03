import { useState } from 'react';
import { conNegrillas } from '../../utils/texto.jsx';
import BotonRegresar from '../../components/BotonRegresar.jsx';

// Iconos por estado, para no depender de que diseño ya haya entregado el
// icono propio de cada estación. Son SVG blancos que se pintan con máscara
// desde el CSS (misma técnica del resto de la app).
// PENDIENTE: el candado es solo el relleno mientras llegan los iconos
// definitivos de cada estación (el camión, el computador, etc.); en cuanto
// estén se llena el campo `icono` en academyDatos.js y este deja de usarse.
const ICONO_BLOQUEADA = '/media/Candado.svg';
const ICONO_COMPLETADA = '/media/Chulo.svg';
// PENDIENTE: relleno para las estaciones desbloqueadas que todavía no tienen
// su icono propio (Ruta Logística y Centro de novedades). No puede ser el
// candado: sería contradictorio mostrar un candado en una estación abierta.
const ICONO_DESBLOQUEADA = '/media/Estrella_Blanca.svg';

// Pantalla 2 de Academy: el camino de estaciones.
//
// Arriba (hero, sobre el naranja): logo, casa, título, barra de avance y
// Codi. Abajo: una hoja blanca de alto fijo con las tres estaciones como
// paneles apilados. La hoja NO se expande como un todo: lo que se abre y se
// cierra son los paneles, cada uno por su cuenta e independiente de los
// otros: al abrir uno se cierra el que estuviera abierto (acordeón).
//
// El camino es lineal: una estación se desbloquea cuando se completa la
// anterior, así que la única que se puede empezar es la primera sin
// completar.
export default function AcademyCamino({ logo, nombre, camino, completadas, onSalir, onAbrirEstacion }) {
  const estaciones = camino.estaciones;

  const total = estaciones.length;
  const hechas = estaciones.filter(e => completadas.includes(e.id)).length;

  // La estación desbloqueada es la primera sin completar. Cuando se termina
  // una, la siguiente pasa a ser esta.
  const idDesbloqueada = estaciones.find(e => !completadas.includes(e.id))?.id ?? null;

  // Un solo panel abierto a la vez (acordeón): abrir uno cierra el otro.
  //
  // Arranca abierto el desbloqueado, que es el que toca hacer. Esto se
  // recalcula cada vez que se entra a esta pantalla, porque al abrir una
  // misión el camino se desmonta: por eso, al volver de completar el
  // Laboratorio, aparece abierta la Ruta Logística y el Laboratorio cerrado.
  const [abierta, setAbierta] = useState(() => idDesbloqueada);

  function estadoDe(estacion) {
    if (completadas.includes(estacion.id)) return 'completada';
    if (estacion.id === idDesbloqueada) return 'desbloqueada';
    return 'bloqueada';
  }

  function iconoDe(estacion, estado) {
    if (estado === 'completada') return ICONO_COMPLETADA;
    if (estado === 'bloqueada') return ICONO_BLOQUEADA;
    return estacion.icono || ICONO_DESBLOQUEADA;
  }

  function alternarPanel(id) {
    setAbierta(actual => (actual === id ? null : id));
  }

  return (
    <div className="academy-view academy-view--camino">
      <div className="academy-fondo" aria-hidden="true" />

      <div className="academy-camino-hero">
        {/* Logo a la izquierda y la casa a la derecha. En la referencia el
            logo va solo a la izquierda; la casa se pone al frente para que
            siempre haya salida hacia la Ruta Winner. */}
        <div className="academy-camino-barra">
          {logo
            ? <img className="academy-camino-logo" src={logo} alt={nombre} />
            : <span className="academy-badge-texto">{nombre}</span>}
          <BotonRegresar
            onClick={onSalir}
            icono="/media/Casa.svg"
            etiqueta="Volver a la Ruta Winner"
          />
        </div>

        <h1 className="academy-camino-titulo">{conNegrillas(camino.titulo)}</h1>

        {/* Barra de avance de las estaciones. Con 0 completadas se ve solo el
            punto verde del inicio (el min-width del CSS), igual que en la
            referencia. */}
        {/* Barra de avance con la insignia de la medalla montada sobre el
            extremo derecho: es el premio que espera al final del camino. */}
        <div className="academy-camino-progreso">
          <div
            className="academy-camino-progreso-carril"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={hechas}
          >
            <div
              className="academy-camino-progreso-barra"
              style={{ width: `${(hechas / total) * 100}%` }}
            />
          </div>
          <span className="academy-camino-progreso-medalla" aria-hidden="true">
            <span className="academy-camino-progreso-medalla-icono" />
          </span>
        </div>

        <img className="academy-camino-codi" src={camino.imagen} alt="" />
      </div>

      <div className="academy-hoja">
        <div className="academy-camino-paneles">
          {estaciones.map((estacion, i) => {
            const estado = estadoDe(estacion);
            const estaAbierta = abierta === estacion.id;
            // Los costados de la etiqueta y del círculo se alternan para que
            // el recorrido zigzaguee, como en el diseño.
            const lado = i % 2 === 0 ? 'izq' : 'der';

            return (
              <section
                key={estacion.id}
                className={`academy-panel academy-panel--${estado} academy-panel--${lado} ${
                  estaAbierta ? 'academy-panel--abierta' : ''
                }`}
              >
                <button
                  type="button"
                  className="academy-panel-cabecera"
                  onClick={() => alternarPanel(estacion.id)}
                  aria-expanded={estaAbierta}
                >
                  <span className="academy-panel-chip">{estacion.nombre}</span>
                  <span className="academy-panel-circulo">
                    <span
                      className="academy-panel-icono"
                      style={{ '--icono': `url("${iconoDe(estacion, estado)}")` }}
                      aria-hidden="true"
                    />
                  </span>
                </button>

                {estaAbierta && (
                  <div className="academy-panel-cuerpo">
                    <div className="academy-panel-cuerpo-texto">
                      <p className="academy-panel-texto">{conNegrillas(estacion.texto)}</p>
                      {/* Solo se puede empezar la estación desbloqueada. Las
                          bloqueadas se pueden abrir y leer, pero no arrancar. */}
                      <button
                        type="button"
                        className="academy-panel-btn"
                        disabled={estado === 'bloqueada'}
                        onClick={() => onAbrirEstacion(estacion)}
                      >
                        {estacion.textoBoton}
                      </button>
                    </div>
                    {estacion.imagen && (
                      <img className="academy-panel-imagen" src={estacion.imagen} alt="" />
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
