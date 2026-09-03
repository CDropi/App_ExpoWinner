import { conNegrillas } from '../../utils/texto.jsx';
import { enPesos } from '../../utils/dinero.js';

// Camión de relleno mientras diseño defina si cada transportadora lleva su
// propio icono o logo.
const ICONO_POR_DEFECTO = '/media/Camion.svg';

// Paso de tipo 'analisisTransportadoras': la tabla de estadísticas de las
// transportadoras, para compararlas antes de ordenarlas por prioridad.
//
// Las tres filas de cada tarjeta salen de los mismos campos para todas, así
// que agregar o quitar una transportadora es tocar solo academyDatos.js.
// La lista llega por prop porque vive en la estación, no en el paso: la
// comparte con la pantalla de ordenarlas.
export default function PasoTransportadoras({ paso, transportadoras, onContinuar }) {
  return (
    <section className="academy-mision-panel academy-mision-panel--transportadoras">
      <h2 className="academy-mision-titulo">{conNegrillas(paso.titulo)}</h2>

      <div className="academy-transportadoras">
        {transportadoras.map(t => (
          <article key={t.id} className="academy-transportadora">
            {/* Icono y nombre en una sola fila arriba, a modo de título de la
                tarjeta: así los datos de abajo aprovechan todo el ancho y no
                quedan apretados en media tarjeta. */}
            <header className="academy-transportadora-cabecera">
              <span className="academy-transportadora-tarjeta">
                <span
                  className="academy-transportadora-icono"
                  style={{ '--icono': `url("${t.icono || ICONO_POR_DEFECTO}")` }}
                  aria-hidden="true"
                />
              </span>
              <span className="academy-transportadora-nombre">{t.nombre}</span>
            </header>

            <div className="academy-transportadora-datos">
              <div className="academy-transportadora-fila">
                <span className="academy-transportadora-etiqueta">
                  {paso.etiquetaCobertura}
                </span>
                <span className="academy-transportadora-valor">{t.cobertura}%</span>
              </div>

              <div className="academy-transportadora-fila">
                <span className="academy-transportadora-etiqueta">
                  {paso.etiquetaEfectividad}
                </span>
                <span className="academy-transportadora-valor">{t.efectividad}</span>
              </div>

              {/* El flete va destacado en verde: es el dato que más pesa a la
                  hora de priorizar. */}
              <div className="academy-transportadora-fila academy-transportadora-fila--flete">
                <span className="academy-transportadora-etiqueta">
                  {paso.etiquetaFlete}
                </span>
                <span className="academy-transportadora-valor">
                  {enPesos(t.flete)} COP
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Ver comentario en academyDatos.js: este botón es la salida hacia el
          paso siguiente, no está en la referencia de diseño. */}
      {paso.textoBoton && (
        <button
          type="button"
          className="academy-transportadoras-btn"
          onClick={onContinuar}
        >
          {paso.textoBoton}
        </button>
      )}
    </section>
  );
}
