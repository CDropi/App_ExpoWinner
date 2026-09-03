/* ============================================================
   rentabilidad.js — la matemática del Laboratorio de Rentabilidad.

   Vive aparte porque la usan dos pantallas (definir el precio y el
   análisis del precio) y las dos tienen que dar exactamente el mismo
   resultado. Si esto estuviera duplicado, cualquier ajuste en una sola
   haría que el resumen y el veredicto se contradijeran.

   Fórmulas maestras:
     Precio objetivo   = Costo total / (1 − % utilidad deseada)
     % utilidad real   = (Precio − Costo total) / Precio
     Brecha vs mercado = Precio − Precio competencia
   ============================================================ */

// Los cortes de utilidad que separan las zonas. El 9% es el techo de la zona
// "verde mínimo" y el 10% el piso de la "verde rentable"; el 19% es el techo
// de la rentable antes de llegar al precio de la competencia.
export const UTILIDAD_MINIMA = 0.09;
export const UTILIDAD_RENTABLE = 0.10;
export const UTILIDAD_TOPE = 0.19;

// Los precios que se muestran se redondean HACIA ABAJO a centenas, que es
// como quedaron los números de referencia del ejercicio: 68.000/0,91 da
// 74.725 y se muestra 74.700.
function aCentenas(valor) {
  return Math.floor(valor / 100) * 100;
}

// Precio al que hay que vender para sacar un porcentaje de utilidad dado.
export function precioParaUtilidad(costoTotal, porcentaje) {
  return aCentenas(costoTotal / (1 - porcentaje));
}

// Los renglones del resumen de costos: el precio que pone el proveedor (que
// cambia por producto) más los costos fijos (flete y CPA promedio, iguales
// para todos).
export function renglonesDeCosto(producto, costos) {
  return [
    { etiqueta: costos.etiquetaProducto, valor: producto.precioProveedor },
    ...costos.fijos,
  ];
}

export function costoTotal(producto, costos) {
  return renglonesDeCosto(producto, costos).reduce((suma, r) => suma + r.valor, 0);
}

// Las cinco zonas de la escala, con el techo de cada una. La última no tiene
// techo (es el "y de ahí para arriba"), por eso va con `hasta: null`.
//
// Se calculan a partir del costo total y del precio de la competencia, así
// que cambian solas con cada producto: no hay que escribirlas a mano.
export function zonasDePrecio(total, precioMercado, etiquetas) {
  return [
    { id: 'perdida', etiqueta: etiquetas.perdida, hasta: total },
    { id: 'minimo', etiqueta: etiquetas.minimo, hasta: precioParaUtilidad(total, UTILIDAD_MINIMA) },
    { id: 'rentable', etiqueta: etiquetas.rentable, hasta: precioParaUtilidad(total, UTILIDAD_TOPE) },
    { id: 'espejo', etiqueta: etiquetas.espejo, hasta: precioMercado },
    { id: 'premium', etiqueta: etiquetas.premium, hasta: null },
  ];
}

// El veredicto de un precio: cuánto se gana, qué margen deja, qué tan lejos
// está del mercado y en qué zona cae.
export function analizarPrecio(precio, total, precioMercado) {
  const ganancia = precio - total;
  const margen = precio > 0 ? ganancia / precio : 0;
  // Negativa = más barato que la competencia; positiva = más caro.
  const brecha = precioMercado != null ? precio - precioMercado : null;

  return { ganancia, margen, brecha, zonaId: zonaDe(precio, total, precioMercado) };
}

// El orden de las preguntas importa: primero los dos casos exactos (pérdida
// y equilibrio), después la comparación con el mercado y solo al final el
// margen. Así un precio por encima de la competencia se lee como premium
// aunque su margen sea bueno.
function zonaDe(precio, total, precioMercado) {
  if (precio < total) return 'perdida';
  if (precio === total) return 'equilibrio';

  if (precioMercado != null) {
    if (precio > precioMercado) return 'premium';
    if (precio === precioMercado) return 'espejo';
  }

  // El piso de la zona rentable es el precio del 10% de utilidad. Se compara
  // contra ese precio y no contra el margen calculado porque el precio va
  // redondeado a centenas: en $75.500 el margen real es 9,93%, pero ese es
  // justamente el número que se le muestra a la persona como el arranque de
  // la zona rentable.
  if (precio < precioParaUtilidad(total, UTILIDAD_RENTABLE)) return 'minimo';
  return 'rentable';
}
