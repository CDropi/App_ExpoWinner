// ============================================================
// Capa de datos. Todas las páginas (Ingreso, Staff) llaman
// SOLO a estas funciones — nunca a Firestore directamente.
//
// Modelo:
//   - "preregistros": gente registrada (viene de la landing pública)
//   - "tickets": una entrada por persona por día elegido (se crea
//     cuando la persona elige ese día en Ingreso)
// ============================================================
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore, doc, getDoc, getDocs, updateDoc, collection, query, where,
  runTransaction, serverTimestamp, increment
} from "firebase/firestore";
import { firebaseConfig, EVENTO, FECHA_SIMULADA_HOY } from "../config.js";

const MESES = { ENE:0, FEB:1, MAR:2, ABR:3, MAY:4, JUN:5, JUL:6, AGO:7, SEP:8, OCT:9, NOV:10, DIC:11 };

// Convierte "25 JUL" + el año del evento en una fecha real, para poder
// compararla contra el día de hoy y así saber si un ticket corresponde
// al día correcto del evento (y no a otro día que aún no ha llegado, o
// que ya pasó).
function fechaDelDia(diaId) {
  const dia = EVENTO.dias.find(d => d.id === diaId);
  if (!dia) return null;
  const [numeroStr, mesStr] = dia.fecha.split(" ");
  const mes = MESES[mesStr.toUpperCase()];
  if (mes === undefined) return null;
  return new Date(Number(EVENTO.anio), mes, Number(numeroStr));
}

function esMismoDiaCalendario(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function hoy() {
  return FECHA_SIMULADA_HOY ? new Date(`${FECHA_SIMULADA_HOY}T12:00:00`) : new Date();
}

function diaCoincideConHoy(diaId) {
  const fecha = fechaDelDia(diaId);
  if (!fecha) return true; // si no se pudo determinar la fecha, no bloqueamos por esto
  return esMismoDiaCalendario(fecha, hoy());
}

let _db = null;
function getDb() {
  if (_db) return _db;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  _db = getFirestore(app);
  return _db;
}

function generarCodigo(usados) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sin 0,O,1,I,L
  let code;
  do {
    code = "";
    for (let i = 0; i < 10; i++) code += chars[Math.floor(Math.random() * chars.length)];
  } while (usados.has(code));
  usados.add(code);
  return code;
}

// ============================================================
// API pública usada por las páginas
// ============================================================

// ---- Ingreso ----

export async function buscarPersonaPorId(idValue) {
  const db = getDb();
  const snap = await getDoc(doc(db, "preregistros", idValue));
  return snap.exists() ? { id: idValue, ...snap.data() } : null;
}

// Marca en el preregistro que esta persona ya creó su contraseña, para que
// la próxima vez que entre le salga "Ingresa tu contraseña" en vez de
// "Crea tu contraseña". Se usa esto en vez de preguntarle a Firebase
// Authentication (fetchSignInMethodsForEmail) porque esa función queda
// inutilizada si el proyecto tiene activada la protección de enumeración de
// correos (Firebase la activa por defecto) — con esa protección activada,
// SIEMPRE responde "no existe" aunque la cuenta sí exista.
// No lanza error hacia afuera: si esto falla, no debe bloquear el ingreso
// de la persona a la app, solo se pierde la comodidad de saltar el paso
// de detección la próxima vez (hay un respaldo para ese caso, ver
// handleCrearPassword en Ingreso.jsx).
export async function marcarCuentaCreada(idValue) {
  try {
    const db = getDb();
    await updateDoc(doc(db, "preregistros", idValue), { tieneCuenta: true });
  } catch (err) {
    console.error('No se pudo marcar tieneCuenta (no bloqueante):', err);
  }
}

// Devuelve los tickets ya elegidos por esta persona (0, 1 o 2)
export async function obtenerTicketsDePersona(idValue) {
  const db = getDb();
  const q = query(collection(db, "tickets"), where("personId", "==", idValue));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ticketCode: d.id, ...d.data() }));
}

// Crea la entrada para un día si no existe todavía. Si ya existe, devuelve la existente
// (evita duplicados si la persona hace doble clic o vuelve a entrar).
export async function elegirDia(idValue, nombre, diaId) {
  const db = getDb();
  const indexRef = doc(db, "ticketIndex", `${idValue}_dia${diaId}`);

  return await runTransaction(db, async (tx) => {
    const indexSnap = await tx.get(indexRef);
    if (indexSnap.exists()) {
      const ticketRef = doc(db, "tickets", indexSnap.data().ticketCode);
      const ticketSnap = await tx.get(ticketRef);
      return { ticketCode: ticketRef.id, ...ticketSnap.data() };
    }
    const ticketCode = generarCodigo(new Set());
    const ticketRef = doc(db, "tickets", ticketCode);
    const nuevo = { personId: idValue, nombre, dia: diaId, checkedIn: false, checkedInAt: null };
    tx.set(ticketRef, nuevo);
    tx.set(indexRef, { ticketCode });
    return { ticketCode, ...nuevo };
  });
}

// ---- Staff ----

export async function procesarCheckin(ticketCode) {
  const db = getDb();
  const ref = doc(db, "tickets", ticketCode);
  return await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return { ok: false, reason: "not_found" };
    const data = snap.data();
    if (data.checkedIn) return { ok: false, reason: "already_used", data };
    if (!diaCoincideConHoy(data.dia)) return { ok: false, reason: "dia_incorrecto", data };
    tx.update(ref, { checkedIn: true, checkedInAt: serverTimestamp() });
    const statsRef = doc(db, "stats", "checkins");
    tx.set(statsRef, { count: increment(1), [`count_dia${data.dia}`]: increment(1) }, { merge: true });
    return { ok: true, data };
  });
}

export async function obtenerContador() {
  const db = getDb();
  const snap = await getDoc(doc(db, "stats", "checkins"));
  return snap.exists() ? (snap.data().count || 0) : 0;
}

// Conteo de ingresos separado por día: { 1: n, 2: n, ... }
export async function obtenerContadoresPorDia() {
  const db = getDb();
  const snap = await getDoc(doc(db, "stats", "checkins"));
  const data = snap.exists() ? snap.data() : {};
  const resultado = {};
  for (const dia of EVENTO.dias) resultado[dia.id] = data[`count_dia${dia.id}`] || 0;
  return resultado;
}

// Lista de personas que YA ingresaron en un día puntual, con su nombre,
// teléfono, correo (cruzando con preregistros) y el código de su ticket.
export async function obtenerAsistentesIngresados(diaId) {
  const db = getDb();
  const q = query(
    collection(db, "tickets"),
    where("dia", "==", diaId),
    where("checkedIn", "==", true)
  );
  const snap = await getDocs(q);
  const ticketsDelDia = snap.docs.map(d => ({ ticketCode: d.id, ...d.data() }));

  // Cruza cada ticket con su preregistro para sacar el correo.
  const conCorreo = await Promise.all(
    ticketsDelDia.map(async (t) => {
      let correo = "";
      try {
        const persona = await buscarPersonaPorId(t.personId);
        correo = persona?.correo || "";
      } catch (err) {
        console.error(err);
      }
      return {
        nombre: t.nombre || "",
        telefono: t.personId || "",
        correo,
        ticketCode: t.ticketCode,
        checkedInAt: t.checkedInAt || null,
      };
    })
  );

  return conCorreo;
}
