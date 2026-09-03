import { enPesos } from '../../utils/dinero.js';
import { costoTotal, zonasDePrecio, analizarPrecio } from '../../utils/rentabilidad.js';

// Paso de tipo 'analisisPrecio': el veredicto del precio que la persona
// escribió en el paso anterior.
//
// Nada de esto viene escrito en los datos: la ganancia, el margen y la
// diferencia contra la competencia se calculan aquí a partir de los costos
// del producto y del precio ingresado, para que no se puedan desincronizar.
// Lo que sí viene de academyDatos.js son los rangos de precio de cada
// producto (`rangos`) y los textos de cada veredicto (`paso.veredictos`).
export default function PasoAnalisisPrecio({ paso, producto, costos, precio, onContinuar }) {
  const mercado = producto.precioMercado;
  const total = costoTotal(producto, costos);

  // Toda la matemática (ganancia, margen, brecha y zona) sale de
  // rentabilidad.js, el mismo módulo del paso anterior.
  const { ganancia, margen, brecha, zonaId } = analizarPrecio(precio, total, mercado);
  const zonas = zonasDePrecio(total, mercado, paso.etiquetasZonas);
  const veredicto = paso.veredictos[zonaId] || {};

  // El margen se muestra con un decimal solo cuando hace falta: el precio
  // espejo da 19,9% y redondeado a entero se leería como 20%, pero un 15%
  // exacto no tiene por qué salir como "15,0%".
  const margenTexto = (Math.round(margen * 1000) / 10)
    .toFixed(1)
    .replace('.0', '')
    .replace('.', ',');

  // La escala muestra cinco zonas; el punto de equilibrio no es una de ellas
  // (es el techo exacto de la de pérdida), así que se resalta esa.
  const zonaResaltada = zonaId === 'equilibrio' ? 'perdida' : zonaId;

  // Texto de la comparación con la competencia. La frase de arriba es
  // aritmética (cambia con el precio) y la de abajo depende del rango, así
  // que se arman por separado.
  // La brecha es negativa cuando el precio está por debajo del de la
  // competencia (más barato) y positiva cuando está por encima.
  let textoCompetencia = '';
  if (brecha != null) {
    if (brecha < 0) textoCompetencia = paso.textoDebajo.replace('{diferencia}', enPesos(-brecha));
    else if (brecha > 0) textoCompetencia = paso.textoEncima.replace('{diferencia}', enPesos(brecha));
    else textoCompetencia = paso.textoIgual;
  }

  return (
    <>
      {/* Tarjeta del veredicto. El color lo pone el rango donde cayó el
          precio (verde si es rentable, rojo si es pérdida, etc.). */}
      <section className={`academy-analisis-tarjeta academy-analisis-tarjeta--${zonaId}`}>
        <h2 className="academy-analisis-titulo">{veredicto.titulo}</h2>

        <div className="academy-analisis-datos">
          <div className="academy-analisis-fila">
            <span>{paso.etiquetaPrecio}</span>
            <span className="academy-analisis-fila-valor">{enPesos(precio)}</span>
          </div>
          <div className="academy-analisis-fila">
            <span>{paso.etiquetaCostos}</span>
            <span className="academy-analisis-fila-valor">{enPesos(total)}</span>
          </div>
          <div className="academy-analisis-fila">
            <span>{paso.etiquetaGanancia}</span>
            <span className="academy-analisis-fila-valor">{enPesos(ganancia)}</span>
          </div>
          <div className="academy-analisis-fila">
            <span>{paso.etiquetaMargen}</span>
            <span className="academy-analisis-fila-valor">{margenTexto}%</span>
          </div>
        </div>
      </section>

      {mercado != null && (
        <div className="academy-analisis-competencia">
          <span>{paso.etiquetaCompetencia}</span>
          <span className="academy-analisis-competencia-valor">{enPesos(mercado)}</span>
        </div>
      )}

      {(textoCompetencia || veredicto.detalle) && (
        <p className={`academy-analisis-frase academy-analisis-frase--${zonaId}`}>
          {textoCompetencia}<br />
          <strong>{veredicto.frase}</strong>
          {veredicto.detalle && (
            <span className="academy-analisis-detalle">{veredicto.detalle}</span>
          )}
        </p>
      )}

      {/* Bloque naranja de abajo: la escala de precios. Va a sangre y crece
          hasta el final de la pantalla. */}
      <div className="academy-analisis-escala-bloque">
        {/* Franja blanca con las esquinas de abajo redondeadas: es la que
            hace que la sección blanca de arriba cierre en curva sobre el
            naranja, como en el diseño. */}
        <span className="academy-analisis-curva" aria-hidden="true" />

        <h3 className="academy-analisis-escala-titulo">{paso.tituloEscala}</h3>

        <div className="academy-analisis-escala">
          {zonas.map((r, i) => {
            // La última zona no tiene techo: se muestra como "+" del techo de
            // la anterior.
            const texto = r.hasta != null
              ? enPesos(r.hasta)
              : `+${enPesos(zonas[i - 1]?.hasta ?? total)}`;
            const esActual = r.id === zonaResaltada;

            return (
              <div
                key={r.id}
                className={`academy-analisis-rango academy-analisis-rango--${r.id} ${
                  esActual ? 'academy-analisis-rango--actual' : ''
                }`}
              >
                <span className="academy-analisis-rango-valor">{texto} →</span>
                <span className="academy-analisis-rango-etiqueta">{r.etiqueta}</span>
              </div>
            );
          })}
        </div>

        {/* Este botón NO está en la referencia de diseño, pero sin él la
            pantalla queda sin salida hacia el paso siguiente. Si diseño
            define otra forma de continuar, se quita de acá y de
            academyDatos.js. */}
        {paso.textoBoton && (
          <button type="button" className="academy-analisis-btn" onClick={onContinuar}>
            {paso.textoBoton}
          </button>
        )}
      </div>
    </>
  );
}
