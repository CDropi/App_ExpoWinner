import { useState } from 'react';

// Paso de tipo 'casoPregunta': un caso real y una pregunta de selección
// única. Va dentro del mismo "sobre" del paso anterior.
//
// `correcta` (en academyDatos.js) es el id de la opción buena. Mientras esté
// en null la pantalla no evalúa: solo registra la respuesta y sigue.
export default function PasoCasoPregunta({ paso, onContinuar }) {
  const [elegida, setElegida] = useState(null);

  return (
    <div
      className={`academy-sobre academy-sobre--caso ${
        paso.fondoImagen ? 'academy-sobre--imagen' : ''
      }`}
      style={paso.sobreArriba ? { '--sobre-arriba': paso.sobreArriba } : undefined}
    >
      {!paso.fondoImagen && (
        <span className="academy-sobre-aletas" aria-hidden="true" />
      )}

      <div className="academy-sobre-hoja">
        <h3 className="academy-caso-titulo">{paso.titulo}</h3>
        <p className="academy-caso-texto">{paso.texto}</p>
        <p className="academy-caso-pregunta">{paso.pregunta}</p>

        <div className="academy-caso-opciones">
          {paso.opciones.map(opcion => (
            <button
              key={opcion.id}
              type="button"
              className={`academy-caso-opcion ${
                elegida === opcion.id ? 'academy-caso-opcion--elegida' : ''
              }`}
              onClick={() => setElegida(opcion.id)}
              aria-pressed={elegida === opcion.id}
            >
              <span className="academy-caso-punto" aria-hidden="true" />
              <span className="academy-caso-opcion-texto">{opcion.texto}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="academy-sobre-btn"
          disabled={!elegida}
          onClick={() => onContinuar(elegida)}
        >
          {paso.textoBoton}
        </button>
      </div>
    </div>
  );
}
