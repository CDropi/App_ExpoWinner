import { useEffect } from 'react';
import { IMAGEN_FONDO_LOGIN } from '../config.js';

export default function SoloMobil() {
  // Esta pantalla puede aparecer ANTES de que Ingreso.jsx o AuthGate.jsx
  // lleguen a montarse (por ejemplo, en Staff, se muestra antes que el
  // login) — así que no podemos depender de que alguno de esos otros
  // componentes ya haya puesto el fondo. Lo aplicamos aquí directamente.
  useEffect(() => {
    document.body.style.backgroundImage = `url("${IMAGEN_FONDO_LOGIN}")`;
    return () => { document.body.style.backgroundImage = ''; };
  }, []);

  return (
    <div className="solo-mobil">      
      <div className="solo-mobil-info">
        <img className="solo-mobil-img" src="media/Logo_ExpoWinner_Horizontal.png" alt=""></img>
        <h1 className="solo-mobil-title">Abre esta página desde tu celular</h1>
        <p className="solo-mobil-text">
        Esta aplicación está diseñada para usarse desde un dispositivo móvil.
        Por favor, abre este enlace desde tu celular para continuar.
        </p>  
      </div>
      <div className="solo-mobil-icon">
        <img src="/media/Codi_Web.png" alt="" />
      </div>
    </div>
  );
}
