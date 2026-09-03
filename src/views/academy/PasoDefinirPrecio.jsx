import { useState } from 'react';
import { conNegrillas } from '../../utils/texto.jsx';
import { enPesos } from '../../utils/dinero.js';
import { renglonesDeCosto, costoTotal } from '../../utils/rentabilidad.js';

// Paso de tipo 'definirPrecio': muestra el producto elegido, el resumen de
// costos de ESE producto y pide un precio de venta.
//
// Los números no están en el paso sino en el producto (academyDatos.js), así
// que el resumen cambia según lo que la persona haya elegido antes.
export default function PasoDefinirPrecio({ paso, producto, costos, onAnalizar }) {
  // Se guarda solo con dígitos y se muestra formateado, para que la persona
  // no tenga que escribir puntos ni el signo de pesos.
  const [precio, setPrecio] = useState('');

  // Los renglones y el total salen de rentabilidad.js, el mismo módulo que
  // usa la pantalla del análisis: así el resumen de acá y el veredicto de
  // allá nunca se pueden contradecir.
  const renglones = renglonesDeCosto(producto, costos);
  const total = costoTotal(producto, costos);

  return (
    <>
      <div className="academy-mision-cabezote">
        <h2 className="academy-mision-cabezote-titulo">{paso.titulo}</h2>
        <p className="academy-mision-cabezote-sub">{paso.subtitulo}</p>
      </div>

      {/* El producto elegido, con la misma tarjeta del paso anterior. Acá el
          botón es solo un recordatorio de lo que se eligió, así que va como
          <span> y no como <button>: no lleva a ninguna parte. */}
      <div className="academy-mision-producto-elegido">
        <article className="academy-producto">
          <div className="academy-producto-foto">
            {producto.imagen
              ? <img src={producto.imagen} alt={producto.nombre} />
              : <span className="academy-producto-foto-vacia">{producto.nombre}</span>}
          </div>
          <span className="academy-producto-btn academy-producto-btn--estatico">
            {paso.textoBotonProducto}
          </span>
        </article>
      </div>

      <section className="academy-mision-panel academy-mision-panel--resumen">
        <h3 className="academy-resumen-titulo">{paso.tituloResumen}</h3>
        <p className="academy-resumen-sub">{conNegrillas(paso.textoResumen)}</p>

        <div className="academy-resumen-tabla">
          {renglones.map(costo => (
            <div key={costo.etiqueta} className="academy-resumen-fila">
              <span>{costo.etiqueta}</span>
              <span className="academy-resumen-fila-valor">{enPesos(costo.valor)}</span>
            </div>
          ))}
          {/* Referencia del mercado: va en la misma tabla pero no suma. */}
          {producto.precioMercado != null && (
            <div className="academy-resumen-fila">
              <span>{paso.etiquetaMercado}</span>
              <span className="academy-resumen-fila-valor">
                {enPesos(producto.precioMercado)}
              </span>
            </div>
          )}
        </div>

        <div className="academy-resumen-total">
          <span>{paso.etiquetaTotal}</span>
          <span>{enPesos(total)}</span>
        </div>

        <p className="academy-resumen-pregunta">{paso.pregunta}</p>
        <p className="academy-resumen-ayuda">{paso.ayuda}</p>

        <input
          type="text"
          className="academy-resumen-input"
          inputMode="numeric"
          autoComplete="off"
          placeholder={paso.placeholderPrecio}
          value={precio ? enPesos(Number(precio)) : ''}
          /* Filtro de solo dígitos: así no entran letras, puntos ni comas que
             después toque limpiar antes de calcular. El tope de 9 dígitos es
             para que no se pueda escribir un número absurdo. */
          onChange={e => setPrecio(e.target.value.replace(/\D/g, '').slice(0, 9))}
        />

        <button
          type="button"
          className="academy-resumen-btn"
          disabled={!precio}
          onClick={() => onAnalizar(Number(precio))}
        >
          {paso.textoBoton}
        </button>
      </section>
    </>
  );
}
