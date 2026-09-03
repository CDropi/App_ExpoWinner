import { conNegrillas } from '../../utils/texto.jsx';

// Paso de tipo 'rankingResultado': después de que la persona armó su orden,
// se le muestra el ranking "de referencia" con los puntos de cada
// transportadora y su virtud, y el cierre de la lección.
//
// El nombre de cada transportadora no se repite en los datos del paso: se
// busca por `id` en la lista de la estación.
export default function PasoRankingResultado({ paso, transportadoras, onContinuar }) {
  const filas = paso.ranking.map(fila => ({
    ...fila,
    nombre: transportadoras.find(t => t.id === fila.id)?.nombre ?? fila.id,
  }));

  return (
    <>
      <h2 className="academy-ranking-titulo">{conNegrillas(paso.titulo)}</h2>

      {paso.personaje && (
        <img className="academy-ranking-personaje" src={paso.personaje} alt="" />
      )}

      {/* La primera fila va destacada: es la mejor puntuada. */}
      <div className="academy-ranking-tarjeta">
        {filas.map((fila, i) => (
          <div
            key={fila.id}
            className={`academy-ranking-fila ${
              i === 0 ? 'academy-ranking-fila--primera' : ''
            }`}
          >
            <span className="academy-ranking-nombre">{fila.nombre}</span>
            <span className="academy-ranking-detalle">
              {fila.puntos} pts · {fila.virtud}
            </span>
          </div>
        ))}
      </div>

      {/* Hoja blanca a sangre con el cierre de la lección. La tarjeta de
          arriba se monta sobre su borde. */}
      <div className="academy-ranking-hoja">
        <p className="academy-ranking-conclusion">{conNegrillas(paso.conclusion)}</p>

        <button type="button" className="academy-ranking-btn" onClick={onContinuar}>
          {paso.textoBoton}
        </button>
      </div>
    </>
  );
}
