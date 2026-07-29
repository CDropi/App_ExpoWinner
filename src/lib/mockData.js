// Datos de ejemplo usados solo cuando MODO_PRUEBA = true en config.js
// Puedes editar/agregar filas aquí para tus propias pruebas.
// "id" aquí representa el número de celular (así se identifica en preregistros).

export const personasIniciales = [
  { id: "3001234567", nombre: "Juan Pérez",   correo: "juan@correo.com" },
  { id: "3007654321", nombre: "María López",  correo: "maria@correo.com" },
  { id: "3012223344", nombre: "Carlos Gómez", correo: "carlos@correo.com" },
  { id: "3019998877", nombre: "Ana Torres",   correo: "ana@correo.com" },
  { id: "3005556677", nombre: "Luis Ramírez", correo: "luis@correo.com" },
];

// Entradas ya elegidas por algunas personas, para poder probar distintos estados
export const ticketsIniciales = [
  // Carlos ya eligió el Día 1 y ya ingresó -> prueba el estado "ingreso registrado"
  { ticketCode: "QW2ES9UZ4C", personId: "3012223344", nombre: "Carlos Gómez", dia: 1, checkedIn: true,  checkedInAt: "2026-07-21T10:00:00.000Z" },
  // María ya eligió el Día 2 pero no ha ingresado -> prueba el estado "válida, sin usar"
  { ticketCode: "7HN3RT8MYB", personId: "3007654321", nombre: "María López",  dia: 2, checkedIn: false, checkedInAt: null },
];
// ↑ Juan, Ana y Luis no tienen ninguna entrada todavía -> al entrar verás la pantalla
//   de elegir día desde cero para ambas fechas.
// ↑ Carlos tiene el Día 1 pero no el Día 2 -> puedes probar que sí puede elegir el que le falta.
