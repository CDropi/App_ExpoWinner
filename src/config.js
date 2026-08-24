// ============================================================
// CONFIGURACIÓN — edita estos valores antes de publicar
// ============================================================

// 0) MODO PRUEBA: mientras esto sea `true`, la app usa datos de ejemplo
//    guardados en el navegador (localStorage) en vez de Firebase.
//    Cuando tengas tu base de datos lista, cambia esto a `false`
//    y llena el firebaseConfig de abajo. No necesitas tocar nada más.
export const MODO_PRUEBA = false;

// 1) Pega aquí la config de tu proyecto Firebase
//    (Firebase Console → Configuración del proyecto → Tus apps → Config)
export const firebaseConfig = {
  apiKey: "AIzaSyD72ciGBECyCXiXdieU6AOxnGFXEcpBz58",
  authDomain: "expo-winners.firebaseapp.com",
  projectId: "expo-winners",
  storageBucket: "expo-winners.firebasestorage.app",
  messagingSenderId: "945406018357",
  appId: "1:945406018357:web:9d3639f4a60f059634427c"
};

// 2) Datos del evento (se muestran en las tarjetas de cada día)
//    Las imágenes viven en /public/media, así que la ruta empieza en "/media/..."
export const EVENTO = {
  nombre: "EXPOWINNERS",
  ciudad: "Bogotá / 8am - 5pm",
  lugar: "Ágora",
  anio: "2026",
  dias: [
    { id: 1, etiqueta: "Día 1", fecha: "12 SEP", imagen: "/media/Banner_1.png" },
    { id: 2, etiqueta: "Día 2", fecha: "13 SEP", imagen: "/media/Banner_2.png" }
  ]
};

// 2.1) Video de la cortinilla de bienvenida. Colócalo en /public/media.
export const VIDEO_INTRO = "/media/Alfa-Logomotion-ExpoWinners.webm";

// 2.2) Imagen de fondo detrás del video/logo de la cortinilla.
export const IMAGEN_INTRO = "/media/Fondo_Intro.jpeg";

// 2.3) Banner promocional que aparece en un popup justo después de iniciar sesión.
export const IMAGEN_POPUP_PROMO = "/media/PIEZA-EXPOWINNER-APP.png";

// 2.4) Imagen de fondo de toda la pantalla de ingreso (login + tabs de días).
export const IMAGEN_FONDO_LOGIN = "/media/Fondo_Login.png";

// 2.5) Logo que aparece en la pantalla de bienvenida (login).
export const LOGO_LOGIN = "/media/Logo_ExpoWinner.png";

// 2.5.1) Logo que aparece en la pantalla de "Mis entradas" / eventos (puede ser distinto al del login).
export const LOGO_APP = "/media/Logo_ExpoWinner_Horizontal.png";

// Logo que aparece en la pantalla de Login del Staff
export const LOGO_LOGIN_STAFF = "/media/Logo_ExpoWinner_Horizontal.png";

// 2.6) URL de tu landing donde las personas se registran (usada en "Regístrate aquí").
export const URL_REGISTRO_LANDING = "https://dropi.co/expowinners";

// 3) PINs válidos para el personal de puerta (agrega los que necesites)
//    Cambia esto antes de publicar. Es una barrera básica, no una autenticación real.
// [Ya no se usa] El PIN se reemplazó por login real con correo/contraseña (ver auth.js / AuthGate.jsx).
export const STAFF_PINS = ["4821", "7350", "9012"];

// 5) Fecha simulada para PROBAR la validación de "día correcto" del check-in
//    sin esperar a la fecha real ni tocar el reloj del celular. Ejemplo:
//    export const FECHA_SIMULADA_HOY = "2026-07-25"; // hace que la app crea que hoy es Día 1
//    Déjalo en null para usar la fecha real del dispositivo (esto es lo que
//    debe quedar antes del evento real).
export const FECHA_SIMULADA_HOY = null;
