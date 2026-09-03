import { conNegrillas } from '../../utils/texto.jsx';

// Paso de tipo 'seleccionProducto': la grilla de productos de la que hay que
// elegir uno para empezar a calcular la rentabilidad.
//
// `onElegir(producto)` avanza al paso siguiente de la misión.
export default function PasoSeleccionProducto({ paso, onElegir }) {
  return (
    <section className="academy-mision-panel">
      <h2 className="academy-mision-titulo">{conNegrillas(paso.titulo)}</h2>

      <div className="academy-mision-grid">
        {paso.productos.map(producto => (
          <article key={producto.id} className="academy-producto">
            <div className="academy-producto-foto">
              {producto.imagen
                ? <img src={producto.imagen} alt={producto.nombre} />
                /* Sin foto todavía: recuadro gris con el nombre, para que no
                   quede una imagen rota mientras diseño las entrega. */
                : <span className="academy-producto-foto-vacia">{producto.nombre}</span>}
            </div>

            <button
              type="button"
              className="academy-producto-btn"
              onClick={() => onElegir(producto)}
            >
              {paso.textoBotonProducto}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
