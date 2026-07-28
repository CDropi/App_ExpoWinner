// auth.js — Login de staff/admin (correo + contraseña).
// No toca el login público de "Ingreso" (ese sigue siendo por teléfono).
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./config.js";

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
