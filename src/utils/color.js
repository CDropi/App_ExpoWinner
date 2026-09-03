// ---- Contraste automático del color de cada marca -----------------
// Sirve para decidir si el texto que va ENCIMA del color de una marca
// debe ser blanco o negro, según qué tan oscuro o claro sea ese color.
// Así, en config.js solo hay que poner el `colorPrimario` de cada marca
// y la app se encarga del contraste sola.

// Umbral de decisión (0 = negro absoluto, 1 = blanco absoluto).
// Si la luminancia del color es MENOR a este valor => el color es
// "oscuro" y el texto va blanco. Si es MAYOR => texto negro.
// Subirlo hace que más colores usen texto negro; bajarlo, más blanco.
const UMBRAL_OSCURIDAD = 0.35;

// Pasa un color hex ("#0DE8C0", "0de8c0", "#fff") a {r, g, b} (0-255).
// Si el valor no se puede leer, devuelve null.
function hexARgb(color) {
  if (typeof color !== 'string') return null;
  let hex = color.trim().replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join(''); // #fff -> #ffffff
  if (hex.length !== 6 || /[^0-9a-f]/i.test(hex)) return null;
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

// Luminancia relativa (norma WCAG). Devuelve un número de 0 a 1:
// 0 = negro, 1 = blanco. Pondera más el verde porque el ojo humano
// lo percibe más brillante que el rojo y el azul.
function luminancia(color) {
  const rgb = hexARgb(color);
  if (!rgb) return 0.5; // valor neutro si el color no se pudo leer
  const canal = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * canal(rgb.r) + 0.7152 * canal(rgb.g) + 0.0722 * canal(rgb.b);
}

// Devuelve el color de texto legible sobre el color dado:
// blanco si el fondo es oscuro, casi-negro si el fondo es claro.
export function textoSobre(color) {
  return luminancia(color) < UMBRAL_OSCURIDAD ? '#FFFFFF' : '#111111';
}
