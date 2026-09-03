import { conNegrillas } from '../../utils/texto.jsx';

// Paso de tipo 'retoIntro': la bienvenida del Centro de novedades. Igual que
// la portada, pero en vez de un botón suelto el llamado a la acción va dentro
// del "sobre" (la hoja crema con las aletas del sobre asomando por detrás).
export default function PasoRetoIntro({ paso, onContinuar }) {
  return (
    <>
      <h2 className="academy-reto-titulo">{conNegrillas(paso.titulo)}</h2>
      {paso.subtitulo && (
        <p className="academy-reto-sub">{paso.subtitulo}</p>
      )}

      {paso.personaje && (
        <img className="academy-reto-personaje" src={paso.personaje} alt="" />
      )}

      {/* Cuando el sobre viene como imagen de fondo, este bloque solo pone el
          texto encima y se posiciona con `sobreArriba`. Sin imagen cae en la
          versión dibujada con CSS (la hoja crema y las aletas). */}
      <div
        className={`academy-sobre ${paso.fondoImagen ? 'academy-sobre--imagen' : ''}`}
        style={paso.sobreArriba ? { '--sobre-arriba': paso.sobreArriba } : undefined}
      >
        {!paso.fondoImagen && (
          <span className="academy-sobre-aletas" aria-hidden="true" />
        )}

        <div className="academy-sobre-hoja">
          <h3 className="academy-sobre-titulo">{paso.tituloSobre}</h3>
          <p className="academy-sobre-texto">{paso.textoSobre}</p>

          <button type="button" className="academy-sobre-btn" onClick={onContinuar}>
            {/* El texto del botón trae \n en los datos: se respeta con
                white-space:pre-line desde el CSS. */}
            {paso.textoBoton}
          </button>
        </div>
      </div>
    </>
  );
}
