import { useEffect, useState } from 'react';

// Umbral de ancho para considerar "celular". 820px cubre teléfonos y
// tablets pequeñas en vertical; por encima de eso se considera
// computador/tablet grande y se bloquea el acceso.
const ANCHO_MAXIMO_MOVIL = 820;

export function useEsMobil() {
  const [esMobil, setEsMobil] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= ANCHO_MAXIMO_MOVIL : true
  );

  useEffect(() => {
    function medir() {
      setEsMobil(window.innerWidth <= ANCHO_MAXIMO_MOVIL);
    }
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, []);

  return esMobil;
}
