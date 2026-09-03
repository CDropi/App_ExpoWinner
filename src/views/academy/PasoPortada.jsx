import { conNegrillas } from '../../utils/texto.jsx';

// Paso de tipo 'portada': la pantalla de bienvenida de una misión. Título,
// subtítulo, el personaje y un botón para arrancar.
//
// Es genérica a propósito: cualquier estación puede tener la suya cambiando
// solo los textos y el personaje en academyDatos.js.
export default function PasoPortada({ paso, onContinuar }) {
  return (
    <div className="academy-portada">
      <h2 className="academy-portada-titulo">{paso.titulo}</h2>
      <p className="academy-portada-sub">{conNegrillas(paso.subtitulo)}</p>

      {paso.personaje && (
        <img className="academy-portada-personaje" src={paso.personaje} alt="" />
      )}

      <button type="button" className="academy-portada-btn" onClick={onContinuar}>
        {paso.textoBoton}
      </button>
    </div>
  );
}
