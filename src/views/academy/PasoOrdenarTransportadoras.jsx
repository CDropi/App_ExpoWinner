import { useState } from 'react';
import { conNegrillas } from '../../utils/texto.jsx';

// Paso de tipo 'ordenarTransportadoras': asignar una posición (1 a N) a cada
// transportadora según cuál usaría primero.
//
// El orden es exclusivo: dos transportadoras no pueden compartir la misma
// posición. Si se elige una posición que ya estaba ocupada, las dos se
// intercambian en vez de dejar un número repetido o un hueco; es más
// perdonable que obligar a la persona a desmarcar primero.
export default function PasoOrdenarTransportadoras({ paso, transportadoras, onContinuar }) {
  // { idTransportadora: posición }
  const [posiciones, setPosiciones] = useState({});

  const total = transportadoras.length;
  const completo = Object.keys(posiciones).length === total;

  function elegirPosicion(id, posicion) {
    setPosiciones(actuales => {
      // Si ya la tenía, se desmarca.
      if (actuales[id] === posicion) {
        const copia = { ...actuales };
        delete copia[id];
        return copia;
      }

      const nuevas = { ...actuales };
      const ocupante = Object.keys(nuevas).find(otro => nuevas[otro] === posicion);
      if (ocupante) {
        // El que estaba en esa posición se queda con la que tenía esta
        // transportadora (o sin ninguna, si no tenía).
        if (nuevas[id] != null) nuevas[ocupante] = nuevas[id];
        else delete nuevas[ocupante];
      }
      nuevas[id] = posicion;
      return nuevas;
    });
  }

  return (
    <>
      <h2 className="academy-orden-titulo">{conNegrillas(paso.titulo)}</h2>

      {paso.personaje && (
        <img className="academy-orden-personaje" src={paso.personaje} alt="" />
      )}

      {/* Hoja blanca de abajo: va a sangre y crece hasta el final de la
          pantalla, igual que la escala de la pantalla de análisis. */}
      <div className="academy-orden-hoja">
        <p className="academy-orden-instruccion">{paso.instruccion}</p>

        <div className="academy-orden-lista">
          {transportadoras.map(t => (
            <div key={t.id} className="academy-orden-fila">
              <span className="academy-orden-nombre">{t.nombre}</span>

              <div className="academy-orden-puestos">
                {Array.from({ length: total }, (_, i) => i + 1).map(posicion => {
                  const elegida = posiciones[t.id] === posicion;
                  return (
                    <button
                      key={posicion}
                      type="button"
                      className={`academy-orden-puesto ${
                        elegida ? 'academy-orden-puesto--elegido' : ''
                      }`}
                      onClick={() => elegirPosicion(t.id, posicion)}
                      aria-pressed={elegida}
                      aria-label={`${t.nombre}, posición ${posicion}`}
                    >
                      <span className="academy-orden-puesto-numero" aria-hidden="true">
                        {posicion}
                      </span>
                      <span className="academy-orden-puesto-punto" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Ver comentario en academyDatos.js: este botón es la salida hacia el
            paso siguiente, no está en la referencia de diseño. */}
        {paso.textoBoton && (
          <button
            type="button"
            className="academy-orden-btn"
            disabled={!completo}
            onClick={() => onContinuar(posiciones)}
          >
            {paso.textoBoton}
          </button>
        )}
      </div>
    </>
  );
}
