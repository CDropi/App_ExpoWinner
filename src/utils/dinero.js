// Formato de pesos colombianos: separador de miles con punto y sin decimales
// ($35.000). Vive aparte porque lo usan varias pantallas de las misiones de
// Academy (el resumen de costos y el análisis del precio).
const formatoPesos = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

export function enPesos(valor) {
  return `$${formatoPesos.format(valor)}`;
}
