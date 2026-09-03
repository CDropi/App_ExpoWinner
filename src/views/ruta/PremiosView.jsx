import { useState } from 'react';
import { LOGO_APP, STANDS } from '../../config.js';
import { conNegrillas } from '../../utils/texto.jsx';
import BotonRegresar from '../../components/BotonRegresar.jsx';
import '../../styles/premios.css';

export default function PremiosView({ standsCompletados, premios, onConfirmar, onRegresar }) {
  const total = STANDS.length;
  const completo = standsCompletados.length === total;
  const [seleccion, setSeleccion] = useState(premios.seleccionados || []);
  const [confirmando, setConfirmando] = useState(false);

  function alternarPremio(standId) {
    if (premios.confirmado) return; // ya quedó bloqueada, no se puede tocar
    setSeleccion(prev => prev.includes(standId) ? prev.filter(id => id !== standId) : [...prev, standId]);
  }

  async function confirmar() {
    if (seleccion.length === 0 || confirmando) return;
    setConfirmando(true);
    try {
      await onConfirmar(seleccion);
    } finally {
      setConfirmando(false);
    }
  }

  // Fila superior de la tarjeta: isotipo de la marca (suelto, sin el círculo
  // de vidrio que tenía antes), el nombre del premio al lado, y el círculo de
  // selección al final. Si alguna marca no tiene isotipo en config.js, cae en
  // la inicial del nombre.
  // Versión anterior (isotipo dentro de un círculo de vidrio tintado con el
  // color de la marca), por si se necesita revertir:
  // function medalla(stand) {
  //   return (
  //     <span
  //       className="premio-card-medalla"
  //       style={{ '--marca': stand.colorPrimario || 'rgba(255,255,255,.4)' }}
  //     >
  //       {stand.isotipo
  //         ? <img className="premio-card-isotipo" src={stand.isotipo} alt="" />
  //         : <span className="premio-card-inicial">{stand.nombre.charAt(0)}</span>}
  //     </span>
  //   );
  // }
  function cabecera(stand) {
    return (
      <span className="premio-card-cabecera">
        {stand.isotipo
          ? <img className="premio-card-isotipo" src={stand.isotipo} alt="" />
          : <span className="premio-card-inicial">{stand.nombre.charAt(0)}</span>}
        <span className="premio-card-nombre">{stand.premio.nombre}</span>
        {/* El círculo de selección queda siempre visible: vacío cuando no
            está elegido y con el chulo blanco sobre naranja cuando sí. */}
        <span className="premio-card-check" aria-hidden="true">
          <img src="/media/Chulo.svg" alt="" />
        </span>
      </span>
    );
  }

  return (
    <div className="premios-view">

      {/* Misma fila superior de la política de datos: regresar circular de
          vidrio a la izquierda y el logo a la derecha, a la misma altura. */}
      <div className="premios-barra-superior">
        <BotonRegresar onClick={onRegresar} />
        <img className="premios-logo" src={LOGO_APP} alt="Expo Winners" />
      </div>

      <div className="premios-encabezado">
        <h2 className="premios-titulo">Mis premios</h2>

      </div>

      {/* De aquí para abajo todo va dentro de un panel de fondo sólido, para
          que se separe visualmente del encabezado (que deja ver el fondo por
          defecto de la app). El panel se estira a los bordes de la pantalla y
          corre hasta el final del scroll. */}
      <div className="premios-panel">

      {!completo && (
        <div className="premios-bloqueado">
          <span className="premios-bloqueado-icono" aria-hidden="true">
            <img src="/media/Candado.svg" alt="" />
          </span>
          <p className="premios-bloqueado-texto">
            Completa los {total} stands de la Ruta Winner para desbloquear la elección de tus premios.
          </p>
          <p className="premios-bloqueado-progreso">{standsCompletados.length} de {total} completados</p>
        </div>
      )}

      {completo && !premios.confirmado && (
        <>
          <p className="premios-sub">
            Elige cuáles de tus {total} premios quieres reclamar. Puedes elegir todos, algunos, o solo uno —
            tú decides.<br/><br/><strong>Ojo:</strong> una vez que confirmes, tu elección queda definitiva y no se puede cambiar.
          </p>
          {/* Antes era una lista de una columna (.premios-lista). Ahora es una
              grilla de dos columnas, tipo tablero de logros. */}
          <div className="premios-grid">
            {STANDS.map(stand => {
              const elegido = seleccion.includes(stand.id);
              return (
                <button
                  type="button"
                  key={stand.id}
                  className={`premio-card ${elegido ? 'elegido' : ''}`}
                  onClick={() => alternarPremio(stand.id)}
                  aria-pressed={elegido}
                >
                  {cabecera(stand)}
                  <span className="premio-card-desc">{conNegrillas(stand.premio.descripcion)}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="actividad-btn premios-confirmar-btn"
            onClick={confirmar}
            disabled={seleccion.length === 0 || confirmando}
          >
            {confirmando ? 'Confirmando...' : `Confirmar selección (${seleccion.length})`}
          </button>
        </>
      )}

      {completo && premios.confirmado && (
        <>
          <p className="premios-sub">Esta es tu selección definitiva de premios.</p>
          <div className="premios-grid">
            {STANDS.filter(stand => premios.seleccionados.includes(stand.id)).map(stand => {
              // Esta pantalla ya no muestra ningún estado de entrega: solo la
              // selección. Se deja comentado el dato por si más adelante se
              // quiere volver a diferenciar el premio ya entregado.
              // const entregado = premios.entregados?.includes(stand.id);
              return (
                <div key={stand.id} className="premio-card confirmado">
                  {cabecera(stand)}
                  <span className="premio-card-desc">{conNegrillas(stand.premio.descripcion)}</span>

                </div>
              );
            })}
          </div>
        </>
      )}

      </div>
    </div>
  );
}
