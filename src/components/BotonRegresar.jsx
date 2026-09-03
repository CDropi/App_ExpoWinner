import '../styles/componentes.css';

// Botón circular de vidrio para salir de una pantalla. Antes estaba copiado
// cuatro veces (política, premios, Academy y la actividad de un stand) con la
// misma receta y cuatro clases distintas.
//
// `flotante`: en las pantallas que ocupan todo el alto (la actividad de un
// stand y Academy) el botón va absoluto sobre el contenido, respetando el
// notch. En las que scrollean dentro de .app-scroll (política y premios) va
// en el flujo normal, porque un botón fijo taparía el encabezado.
// `icono`: por defecto la flecha de "atrás". Academy pasa la casa, porque
// desde sus pantallas el botón no devuelve un paso sino que sale de la mini
// experiencia y vuelve a la Ruta Winner.
export default function BotonRegresar({
  onClick,
  flotante = false,
  etiqueta = 'Regresar',
  icono = '/media/Atras.svg',
}) {
  return (
    <button
      type="button"
      className={`btn-regresar ${flotante ? 'btn-regresar--flotante' : ''}`}
      onClick={onClick}
      aria-label={etiqueta}
    >
      {/* Versión anterior (icono fijo):
      <img src="/media/Atras.svg" alt="" />
      */}
      <img src={icono} alt="" />
    </button>
  );
}
