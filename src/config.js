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
  nombre: "EXPO WINNER",
  ciudad: "Bogotá",
  lugar: "Ágora",
  anio: "2026",
  dias: [
    { id: 1, etiqueta: "Día 1", fecha: "25 JUL", hora: "18:00", imagen: "/media/Banner1.jpg" },
    { id: 2, etiqueta: "Día 2", fecha: "26 JUL", hora: "18:00", imagen: "/media/Banner1.jpg" }
  ]
};

// 2.1) Video de la cortinilla de bienvenida. Colócalo en /public/media.
export const VIDEO_INTRO = "/media/Alfa-Logomotion-ExpoWinners.webm";

// 2.2) Imagen de fondo detrás del video/logo de la cortinilla.
export const IMAGEN_INTRO = "/media/Fondo_Intro.jpeg";

// 2.3) Banner promocional que aparece en un popup justo después de iniciar sesión.
export const IMAGEN_POPUP_PROMO = "/media/1.png";

// 2.4) Imagen de fondo de toda la pantalla de ingreso (login + tabs de días).
export const IMAGEN_FONDO_LOGIN = "/media/Fondo_Login.png";

// 2.5) Logo que aparece en la pantalla de bienvenida (login).
export const LOGO_LOGIN = "/media/Logo_ExpoWinner.png";

// 2.5.1) Logo que aparece en la pantalla de "Mis entradas" / eventos (puede ser distinto al del login).
export const LOGO_APP = "/media/Logo_ExpoWinner_Horizontal.png";

// 2.6) URL de tu landing donde las personas se registran (usada en "Regístrate aquí").
export const URL_REGISTRO_LANDING = "https://tu-landing.com/registro";

// 3) PINs válidos para el personal de puerta (agrega los que necesites)
//    Cambia esto antes de publicar. Es una barrera básica, no una autenticación real.
// [Ya no se usa] El PIN se reemplazó por login real con correo/contraseña (ver auth.js / AuthGate.jsx).
export const STAFF_PINS = ["4821", "7350", "9012"];
