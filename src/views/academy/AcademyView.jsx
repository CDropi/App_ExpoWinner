import { useState } from 'react';
import { ACADEMY } from '../../data/academyDatos.js';
import AcademyIntro from './AcademyIntro.jsx';
import AcademyCamino from './AcademyCamino.jsx';
import AcademyMision from './AcademyMision.jsx';
import '../../styles/academy.css';

// Contenedor de la mini experiencia de Academy. Academy tiene varias
// pantallas propias, así que aquí solo se decide cuál se muestra y se guarda
// el avance; el contenido de cada una vive en academyDatos.js y el dibujo en
// los componentes de esta misma carpeta.
//
// `onSalir` cierra Academy y devuelve al mapa de la Ruta Winner (es lo que
// hace el botón de la casa en la bienvenida y en el camino).
export default function AcademyView({ onSalir }) {
  // Pantalla visible: 'intro' | 'camino' | 'mision'.
  const [pantalla, setPantalla] = useState('intro');

  // Estación cuya misión se está haciendo (solo cuando pantalla === 'mision').
  const [estacionActiva, setEstacionActiva] = useState(null);

  // PENDIENTE: el avance de Academy todavía no se guarda en ningún lado.
  // Cuando se defina, esto pasa a dataLayer.js (como standProgress) para que
  // sobreviva a recargar la página.
  const [completadas, setCompletadas] = useState([]);

  // Antes esto marcaba la estación como completada de una (era el atajo de
  // MODO_PRUEBA para poder ver los estados del camino). Ahora abre la misión
  // de verdad, y la estación se completa al terminar el último paso.
  function abrirEstacion(estacion) {
    setEstacionActiva(estacion);
    setPantalla('mision');
  }

  function volverAlCamino() {
    setEstacionActiva(null);
    setPantalla('camino');
  }

  function terminarMision() {
    if (estacionActiva) {
      setCompletadas(actuales =>
        actuales.includes(estacionActiva.id) ? actuales : [...actuales, estacionActiva.id]
      );
    }
    volverAlCamino();
  }

  if (pantalla === 'mision' && estacionActiva) {
    return (
      <AcademyMision
        logo={ACADEMY.logo}
        logoNaranja={ACADEMY.logoNaranja}
        nombre={ACADEMY.nombre}
        estacion={estacionActiva}
        onVolver={volverAlCamino}
        onTerminar={terminarMision}
        onSalir={onSalir}
      />
    );
  }

  if (pantalla === 'camino') {
    return (
      <AcademyCamino
        logo={ACADEMY.logo}
        nombre={ACADEMY.nombre}
        camino={ACADEMY.camino}
        completadas={completadas}
        onSalir={onSalir}
        onAbrirEstacion={abrirEstacion}
      />
    );
  }

  return (
    <AcademyIntro
      logo={ACADEMY.logo}
      nombre={ACADEMY.nombre}
      intro={ACADEMY.intro}
      onSalir={onSalir}
      onEmpezar={() => setPantalla('camino')}
    />
  );
}
