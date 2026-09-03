// Helpers de texto compartidos por las pantallas que muestran copy
// editable desde config.js.

// Convierte "texto **resaltado** normal" en JSX: las partes entre
// **asteriscos** quedan en <strong>, y cada \n se vuelve un salto de línea
// real (<br />). Así, en config.js, cada marca controla negrillas y saltos
// de línea de su "bienvenida" sin tocar código.
export function conNegrillas(texto) {
  if (!texto) return texto;
  return texto.split('\n').map((linea, i, arr) => (
    <span key={i}>
      {linea.split(/\*\*(.+?)\*\*/g).map((parte, j) =>
        j % 2 === 1 ? <strong key={j}>{parte}</strong> : parte
      )}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}
