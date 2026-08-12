// auth.js — Login de staff/admin (correo + contraseña).
// No toca el login público de "Ingreso" (ese sigue siendo por teléfono).
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail, signInAnonymously, signOut, onAuthStateChanged
} from "firebase/auth";
import { firebaseConfig } from "../config.js";

let _auth = null;
function getFirebaseAuth() {
  if (_auth) return _auth;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  _auth = getAuth(app);
  return _auth;
}

export async function loginStaff(email, password) {
  const auth = getFirebaseAuth();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutStaff() {
  await signOut(getFirebaseAuth());
}

// callback(user) se llama cada vez que cambia la sesión; user es null si no hay nadie logueado.
export function onStaffAuthChange(callback) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export function getCurrentStaffUser() {
  return getFirebaseAuth().currentUser;
}

// [Reemplazado por login de teléfono+contraseña, ver más abajo. No borrar
// por si se necesita reactivar el modo anónimo en el futuro.]
// export async function asegurarSesionAnonima() {
//   const auth = getFirebaseAuth();
//   if (auth.currentUser) return auth.currentUser;
//   const cred = await signInAnonymously(auth);
//   return cred.user;
// }

// ============================================================
// Login de asistentes: teléfono + contraseña.
//
// Firebase Auth no tiene "teléfono como usuario con contraseña" nativo
// (el login por teléfono de Firebase usa SMS/OTP, que es otra cosa).
// Por eso el teléfono se convierte internamente en un correo ficticio
// (ej. "3001234567@expowinners.app") y se usa el login normal de
// correo+contraseña de Firebase por debajo. El asistente nunca ve ese
// correo — solo escribe su celular y su contraseña.
// ============================================================

const DOMINIO_INTERNO = "expowinners.app";

function telefonoAEmail(telefono) {
  const limpio = String(telefono).trim().replace(/[^0-9]/g, "");
  return `${limpio}@${DOMINIO_INTERNO}`;
}

// true si ese teléfono ya tiene una contraseña creada (no es su primera vez).
export async function existeCuentaParaTelefono(telefono) {
  const auth = getFirebaseAuth();
  const metodos = await fetchSignInMethodsForEmail(auth, telefonoAEmail(telefono));
  return metodos.length > 0;
}

// Primera vez: crea la contraseña para ese teléfono y deja la sesión iniciada.
export async function crearContrasenaParaTelefono(telefono, password) {
  const auth = getFirebaseAuth();
  const cred = await createUserWithEmailAndPassword(auth, telefonoAEmail(telefono), password);
  return cred.user;
}

// Ya tiene cuenta: valida teléfono + contraseña e inicia sesión.
export async function iniciarSesionConTelefono(telefono, password) {
  const auth = getFirebaseAuth();
  const cred = await signInWithEmailAndPassword(auth, telefonoAEmail(telefono), password);
  return cred.user;
}
