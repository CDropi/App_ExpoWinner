import { useState } from 'react';
import BotonRegresar from '../../components/BotonRegresar.jsx';
import PasoSeleccionProducto from './PasoSeleccionProducto.jsx';
import PasoDefinirPrecio from './PasoDefinirPrecio.jsx';
import PasoAnalisisPrecio from './PasoAnalisisPrecio.jsx';
import PasoPortada from './PasoPortada.jsx';
import PasoTransportadoras from './PasoTransportadoras.jsx';
import PasoOrdenarTransportadoras from './PasoOrdenarTransportadoras.jsx';
import PasoRankingResultado from './PasoRankingResultado.jsx';
import PasoRetoIntro from './PasoRetoIntro.jsx';
import PasoCasoPregunta from './PasoCasoPregunta.jsx';
import PasoMisionCompletada from './PasoMisionCompletada.jsx';
import '../../styles/academyMision.css';

// La misión de una estación. Este componente solo se encarga de la parte que
// se repite en todos los pasos (logo, Codi, barra de avance con la medalla) y
// de ir pasando de un paso al siguiente; lo que cambia adentro lo dibuja el
// componente del `tipo` de paso.
//
// Los pasos vienen de academyDatos.js -> estacion.pasos, así que agregar una
// pantalla nueva es agregar un objeto a ese array y, si es un tipo nuevo, un
// componente en el `switch` de abajo.
//
// `onVolver` regresa al camino de estaciones sin terminar la misión.
// `onTerminar` la marca como completada y también regresa al camino.
// `onSalir` cierra Academy y vuelve al mapa de la Ruta Winner.
export default function AcademyMision({ logo, logoNaranja, nombre, estacion, onVolver, onTerminar, onSalir }) {
  const [indice, setIndice] = useState(0);

  // Lo que va respondiendo la persona a lo largo de la misión (por ejemplo el
  // producto que eligió). Se guarda acá porque los pasos siguientes lo
  // necesitan: el cálculo de rentabilidad se hace sobre ese producto.
  // PENDIENTE: cuando el avance de Academy se persista, esto también.
  const [respuestas, setRespuestas] = useState({});

  const pasos = estacion.pasos || [];
  const paso = pasos[indice];

  // La flecha devuelve UNA pantalla: si hay un paso antes en la misión va a
  // ese, y solo cuando ya se está en el primero sale al camino de estaciones.
  function atras() {
    if (indice > 0) setIndice(i => i - 1);
    else onVolver();
  }

  function siguiente(datos) {
    if (datos) setRespuestas(actuales => ({ ...actuales, ...datos }));
    // Si era el último paso, la estación queda completada.
    if (indice >= pasos.length - 1) onTerminar();
    else setIndice(i => i + 1);
  }

  // Las otras dos estaciones todavía no tienen pasos definidos: en vez de
  // dejar la pantalla en blanco, se avisa y se deja la salida a mano.
  if (!paso) {
    return (
      <div className="academy-mision academy-mision--claro">
        <div className="academy-mision-barra">
          <img className="academy-mision-logo" src={logoNaranja} alt={nombre} />
          <div className="academy-mision-acciones">
            <BotonRegresar onClick={onVolver} etiqueta="Volver al camino" />
            <BotonRegresar
              onClick={onSalir}
              icono="/media/Casa.svg"
              etiqueta="Volver a la Ruta Winner"
            />
          </div>
        </div>
        <section className="academy-mision-panel">
          <h2 className="academy-mision-titulo">{estacion.nombre}</h2>
          <p className="academy-mision-vacio">
            Esta estación todavía está en construcción.
          </p>
        </section>
      </div>
    );
  }

  // Los fondos oscuros ('naranja' y 'damero') llevan el logo blanco; el claro
  // lleva el naranja.
  const fondoOscuro = paso.fondo === 'naranja' || paso.fondo === 'damero';

  return (
    <div
      className={`academy-mision academy-mision--${paso.fondo || 'claro'} ${
        paso.fondoImagen ? 'academy-mision--imagen' : ''
      }`}
      /* La imagen de fondo llega como variable para que la pinte la misma
         capa fija que ya maneja los fondos (ver academyMision.css): así no
         hace falta otra capa ni pelear con el z-index. */
      style={paso.fondoImagen ? { '--fondo-imagen': `url("${paso.fondoImagen}")` } : undefined}
    >
      <div
        className={`academy-mision-barra ${
          paso.logoCentrado ? 'academy-mision-barra--centrada' : ''
        }`}
      >
        {/* El logo cambia según el fondo del paso: el naranja sobre blanco y
            el blanco sobre naranja. */}
        <img
          className="academy-mision-logo"
          src={fondoOscuro ? logo : logoNaranja}
          alt={nombre}
        />
        {/* Dos salidas: la flecha devuelve una sola pantalla (el paso
            anterior de la misión, o el camino si ya se está en el primero) y
            la casa sale de Academy hacia el mapa de la Ruta Winner. */}
        <div className="academy-mision-acciones">
          <BotonRegresar onClick={atras} etiqueta="Volver a la pantalla anterior" />
          <BotonRegresar
            onClick={onSalir}
            icono="/media/Casa.svg"
            etiqueta="Volver a la Ruta Winner"
          />
        </div>
      </div>

      {paso.imagen && (
        <img className="academy-mision-codi" src={paso.imagen} alt="" />
      )}

      {/* Barra de avance de la misión, con la medalla del final del camino
          montada sobre el extremo derecho. Solo se dibuja en los pasos que
          traen `avance`: en la referencia no todas las pantallas la muestran. */}
      {paso.avance != null && (
      <div className="academy-mision-progreso">
        <div
          className="academy-mision-progreso-carril"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((paso.avance ?? 0) * 100)}
        >
          <div
            className="academy-mision-progreso-barra"
            style={{ width: `${(paso.avance ?? 0) * 100}%` }}
          />
        </div>
        {/* PENDIENTE: reemplazar por la medalla definitiva de diseño. */}
        <span className="academy-mision-progreso-medalla" aria-hidden="true">
          <span className="academy-mision-progreso-medalla-icono" />
        </span>
      </div>
      )}

      {paso.tipo === 'portada' && (
        <PasoPortada paso={paso} onContinuar={() => siguiente()} />
      )}

      {paso.tipo === 'analisisTransportadoras' && (
        <PasoTransportadoras
          paso={paso}
          transportadoras={estacion.transportadoras}
          onContinuar={() => siguiente()}
        />
      )}

      {paso.tipo === 'ordenarTransportadoras' && (
        <PasoOrdenarTransportadoras
          paso={paso}
          transportadoras={estacion.transportadoras}
          onContinuar={orden => siguiente({ orden })}
        />
      )}

      {paso.tipo === 'retoIntro' && (
        <PasoRetoIntro paso={paso} onContinuar={() => siguiente()} />
      )}

      {paso.tipo === 'casoPregunta' && (
        <PasoCasoPregunta
          paso={paso}
          onContinuar={respuesta => siguiente({ [`caso-${paso.id}`]: respuesta })}
        />
      )}

      {paso.tipo === 'misionCompletada' && (
        <PasoMisionCompletada paso={paso} onContinuar={() => siguiente()} />
      )}

      {paso.tipo === 'rankingResultado' && (
        <PasoRankingResultado
          paso={paso}
          transportadoras={estacion.transportadoras}
          onContinuar={() => siguiente()}
        />
      )}

      {paso.tipo === 'seleccionProducto' && (
        <PasoSeleccionProducto
          paso={paso}
          /* Se guarda el producto completo (no solo el id) porque los pasos
             siguientes necesitan sus costos. */
          onElegir={producto => siguiente({ producto })}
        />
      )}

      {paso.tipo === 'definirPrecio' && respuestas.producto && (
        <PasoDefinirPrecio
          paso={paso}
          producto={respuestas.producto}
          costos={estacion.costos}
          onAnalizar={precio => siguiente({ precio })}
        />
      )}

      {paso.tipo === 'analisisPrecio' && respuestas.producto && (
        <PasoAnalisisPrecio
          paso={paso}
          producto={respuestas.producto}
          costos={estacion.costos}
          precio={respuestas.precio}
          onContinuar={() => siguiente()}
        />
      )}
    </div>
  );
}
