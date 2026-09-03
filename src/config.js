// 0) MODO PRUEBA: mientras esto sea `true`, la app usa datos de ejemplo
//    guardados en el navegador (localStorage) en vez de Firebase.
//    Cuando tengas tu base de datos lista, cambia esto a `false`
//    y llena el firebaseConfig de abajo. No necesitas tocar nada más.
export const MODO_PRUEBA = true;

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

// 2.1) Video de la cortinilla de bienvenida.
export const VIDEO_INTRO = "/media/Alfa-Logomotion-ExpoWinners.webm";

// 2.2) Imagen de fondo detrás del video/logo de la cortinilla.
export const IMAGEN_INTRO = "/media/Fondo_Intro.jpeg";

// 2.3) Banner promocional que aparece en un popup justo después de iniciar sesión.
export const IMAGEN_POPUP_PROMO = "/media/PIEZA-EXPOWINNER-APP.png";

// 2.4) Imagen de fondo de toda la pantalla de ingreso (login + tabs de días).
export const IMAGEN_FONDO_LOGIN = "/media/Fondo_Login.png";

// 2.4.1) Imagen de fondo exclusiva de la pantalla de Perfil.
export const IMAGEN_FONDO_PERFIL = "/media/Fondo_Perfil.png";

// 2.5) Logo que aparece en la pantalla de bienvenida (login).
export const LOGO_LOGIN = "/media/Logo_ExpoWinner.png";

// 2.5.1) Logo que aparece en la pantalla de "Mis entradas" / eventos
export const LOGO_APP = "/media/Logo_ExpoWinner_Horizontal.png";

// Logo que aparece en la pantalla de Login del Staff
export const LOGO_LOGIN_STAFF = "/media/Logo_ExpoWinner_Horizontal.png";

// 2.6) URL de tu landing donde las personas se registran
export const URL_REGISTRO_LANDING = "https://dropi.co/expowinners";

// 2.6.1) Política de tratamiento de datos, se consulta desde la pestaña Perfil.
export const URL_POLITICA_DATOS = "https://dropi.co/politica-privacidad";

// 2.7) Mapa del recinto 
export const IMAGEN_MAPA_PLANO = "/media/Fondo_Mapa.png";

export const STANDS = [
  {
    id: "roax", nombre: "Roax", x: 29, y: 25, qrCode: "RUTA-ROAX",
    colorPrimario: "#5C00D3",
    imagenFondo: "/media/Fondo_Roax.png",
    imagenMapaCompletado: "/media/Fondo_Mapa_Roax.png",
    logo: "/media/Logo_Roax.png",
    isotipo: "/media/Isotipo_Roax.png",
    bienvenida: "Escalar una campaña **sin datos** es como manejar con los ojos cerrados. En ROAX **somos el copiloto** que te dice cuándo escalar, ajustar o frenar, **antes de que pierdas plata.**\n\nPon a prueba tu criterio con 2 casos reales de **media buying y rentabilidad**, y obtén un beneficio exclusivo.",
    mensajeExito: "1. **60 dias gratis** de Roax Pro.\n\n2. **Membresia** de Alertas con Ai.\n\n3. Informes **especializados.**\n\n4. Posibilidad de lanzar campañas con **creativos propios.**\n\n5. Acceso **prioritario** a crédito de Ads.",
    premio: { nombre: "Premio Roax", descripcion: "1. 60 días de Roax Pro \n2.Membresia de Alertas con Ai \n3. Informes especializados \n4. Campañas con creativos propios \n5. Acceso a crédito de Ads" },
    preguntas: [
      {
        texto: "Entre el día 4 y 7 de tu campaña, tu anuncio tiene un CTR alto, pero CVR muy bajo en tu tienda. ¿Cuál es el diagnóstico correcto?",
        opciones: ["El creativo se fatigó; Apaga el anuncio para no quemar presupuesto", "El anuncio funciona, pero la Landing Page o el precio están frenando la venta. Optimiza la web, no el creativo", "El anuncio es un ganador indiscutible; Duplica el presupuesto para que Meta fuerce las ventas"],
      },
      {
        texto: "En fase de escalado (día 7+), Meta muestra CPA bajo y alto volumen de pedidos, pero la entrega en Dropi cayó por debajo del 75%. ¿Cuál es la decisión correcta?",
        opciones: ["Aumentar el presupuesto; el CPA bajo y el volumen compensarán las devoluciones", "Frena el escalado y solo continúa si la efectividad supera el 80%", "Apagar la campaña y probar creativos más cortos para evitar devoluciones"],
      },
    ],
  },
  {
    id: "confio", nombre: "Confío Pagos", x: 71, y: 25.5, qrCode: "RUTA-CONFIO",
    colorPrimario: "#8FE2AF",
    imagenFondo: "/media/Fondo_Confio.png",
    imagenMapaCompletado: "/media/Fondo_Mapa_Confio.png",
    logo: "/media/Logo_ConfioPagos.png",
    isotipo: "/media/Isotipo_Confio.png",
    bienvenida: "Las devoluciones **te cuestan** tiempo y dinero. Con Confío Pagos, tu cliente paga con confianza y tú **recuperas el 100%** si algo falla.\n\nResponde 2 preguntas sobre cómo **afectan las devoluciones** y desbloquea una sorpresa.", // mensaje de bienvenida personalizado de esta marca (cuando lo tengas)
    mensajeExito: "Recibe una tarifa especial por los primeros 30 días.",
    premio: { nombre: "Premio Confío Pagos", descripcion: "Tarifa especial por los primeros 30 días" },
    preguntas: [
      {
        texto: "¿Sabes cuánto te cuesta hoy una devolución?",
        opciones: ["Aproximadamente $18.000, lo que cuesta el envío", "No cuesta nada, las paga el cliente, las tengo costeadas", "Entre $25.000 y $35.000", "Ni idea"],
      },
      {
        texto: "¿Sabes cuál es el principal motivo porque se dan las devoluciones?",
        opciones: ["El cliente se arrepintió", "Era una venta de impulso y la bodega y la transportadora se demoraron mucho", "No logré elevar el compromiso con la compra", "No tienen dinero e igual hacen pedidos"],
      },
    ],
  },
  {
    id: "atom", nombre: "ATOM", x: 9, y: 41.8, qrCode: "RUTA-ATOM",
    colorPrimario: "#0DE8C0",
    imagenFondo: "/media/Fondo_Atom.png",
    imagenMapaCompletado: "/media/Fondo_Mapa_Atom.png",
    logo: "/media/Logo_ATOM.png",
    isotipo: "/media/Isotipo_ATOM.png",
    premio: { nombre: "Premio ATOM", descripcion: "- Privatización de un producto\n\n- Un incentivo exclusivo por cumplimiento de metas logísticas" },
    bienvenida: "En ATOM creemos que un buen proveedor no solo despacha, **impulsa tu negocio**. \n \n Responde 2 preguntas rápidas sobre cómo trabajas con los tuyos y **desbloquea un beneficio exclusivo**.",
    mensajeExito: "Busca un proveedor con el distintivo de \"**Proveedor de Alto Rendimiento ATOM**\" para que puedas coordinar **la privatización de un producto + un incentivo exclusivo** por cumplimiento de metas logísticas.",
    preguntas: [
      {
        texto: "¿Cómo describirías la relación operativa con el proveedor de tus productos ganadores?",
        opciones: ["Solo despacha mis pedidos.", "Es mi aliado estratégico que me ayuda a entregar más en menos tiempo."],
      },
      {
        texto: "Si mantienes una alta cantidad de ventas y bajas devoluciones, ¿qué incentivo te da tu proveedor actual?",
        opciones: ["Ninguno, el trato es normal.", "Me ofrece incentivos y alianzas exclusivas para crecer con él."],
      },
    ],
  },
  {
    id: "chateapro", nombre: "Chatea Pro", x: 91, y: 41.5, qrCode: "RUTA-CHATEAPRO",
    colorPrimario: "#009ee3",
    imagenFondo: "/media/Fondo_Chatea.png",
    imagenMapaCompletado: "/media/Fondo_Mapa_ChateaPro.png",
    logo: "/media/Logo_Chatea.png",
    isotipo: "/media/Isotipo_Chatea.png",
    bienvenida: "Sabemos que cada pedido **gestionado a tiempo** es una **venta ganada**, y que **automatizar** tu operación no debería ser complicado. \n \n Cuéntanos cómo **gestionas** tus pedidos y descubre algo especial que preparamos **solo para ti.**", // mensaje de bienvenida personalizado de esta marca (cuando lo tengas)
    mensajeExito: "CLIENTES NUEVOS:\n- Activa Chatea Pro **HOY** y recibe un bono de **$10USD** en tu primera facturación.\n- Participa automáticamente en el **sorteo** de una **implementación personalizada** de Chatea Pro.\n\nCLIENTES ACTUALES:\nRecibe un **5% de descuento** en tu siguiente facturación.", // mensaje que se muestra al desbloquear el logro de esta marca (cuando lo tengas)
    premio: { nombre: "Premio Chatea Pro", descripcion: "CLIENTES NUEVOS:\n Bono de $10USD en la primera facturación + sorteo de implementación personal\n\nCLIENTES ACTUALES:\n5% de descuento en la siguiente facturación." },
    preguntas: [
      {
        texto: "¿Cuántos pedidos gestionas en promedio por día?",
        opciones: ["Menos de 10", "Entre 10 y 30", "Entre 31 y 100", "Más de 100"],
      },
      {
        texto: "¿Qué plataforma utilizas actualmente para gestionar tu operación?",
        opciones: ["Dropi", "Chatea Pro", "Dropi + Chatea Pro", "Ninguna"],
      },
    ],
  },
  {
    id: "fenix", nombre: "Fénix", x: 17.2, y: 59.8, qrCode: "RUTA-FENIX",
    colorPrimario: "#1c8e40",
    imagenFondo: "/media/Fondo_Fenix.png",
    imagenMapaCompletado: "/media/Fondo_Mapa_Fenix.png",
    logo: "/media/Logo_Fenix.png",
    isotipo: "/media/Isotipo_Fenix.png",
    bienvenida: "Vender mucho y ganar dinero **no siempre** es lo mismo. En Fénix te ayudamos a pasar de **dropshipper a empresario**, con logística e infraestructura para operar en **toda Latam**.\n\nCuéntanos un poco sobre tu operación y descubre algo **especial** que preparamos para ti.",
    mensajeExito: "*** CONSULTORÍA GRATUITA**\nSi tienes más de 10 ventas diarias.\n\n*** 20% DESCUENTO**\nen implementación de Chatea Pro si tienes entre 1-10 ventas diarias.\n\n*** Academia 15 días gratis** / Lexi\nSi aún no vendes.",
    premio: { nombre: "Premio Fénix", descripcion: "-CONSULTORÍA GRATUITA si tienes más de 10 ventas diarias\n\n- 20% DESCUENTO en implementación de Chatea Pro si tienes entre 1-10 ventas diarias\n\n- Academia 15 días gratis/Lexi si aún no vendes" },
    preguntas: [
      {
        texto: "¿Cuántas ventas en tu tienda virtual de productos (dropshipping o marca propia) tienes al día?",
        opciones: ["Aún no vendo de esa forma", "1-10 ventas diarias", "11-50 ventas diarias", "Más de 50 ventas diarias"],
      },
      {
        texto: "¿En qué país(es) vendes?",
        opciones: ["Colombia", "Ecuador", "Chile", "México", "Panamá", "Guatemala", "Paraguay", "Argentina", "Perú", "Aún no vendo"],
        multiple: true, // permite marcar más de una opción (puede vender en varios países)
      },
    ],
  },
  {
    id: "dropipay", nombre: "DropiPay", x: 84.8, y: 60, qrCode: "RUTA-DROPIPAY",
    colorPrimario: "#f4993c",
    imagenFondo: "/media/Fondo_DropiPay.png",
    imagenMapaCompletado: "/media/Fondo_Mapa_DropiPay.png",
    logo: "/media/Logo_DropiPay.png",
    isotipo: "/media/Isotipo_DropiPay.png",
    bienvenida: "En dropiPay importas, pagas y accedes a crédito sin drama, **sin bancos y sin fronteras.**\n\nCuéntanos qué tanto conoces de **nuestra plataforma** y descubre algo que preparamos para ti.",
    mensajeExito: "Si eres **usuario registrado** en DropiPay, participas en el sorteo de **100 USDT** al final del día",
    premio: { nombre: "Premio DropiPay", descripcion: "Usuarios registrados en DropiPay participan en el sorteo de 100 USDT" },
    preguntas: [
      {
        texto: "¿Tiene costo generar una PayCard en dropiPay?",
        opciones: ["Si", "No"],
      },
      {
        texto: "¿Cuál es el costo por retirar COP a USDT en dropiPay?",
        opciones: ["5 USDT por transacción, sin importar el monto", "4.5% por el valor transado", "3 USDT por transacción, sin importar el monto"],
      },
    ],
  }, 
  {
    id: "groupack", nombre: "Groupack", x: 49, y: 66, qrCode: "RUTA-GROUPACK",
    colorPrimario: "#fbea20",
    imagenFondo: "/media/Fondo_Groupack.png",
    imagenMapaCompletado: "/media/Fondo_Mapa_Groupack.png",
    logo: "/media/Logo_Groupack.png",
    isotipo: "/media/Isotipo_Groupack.png",
    bienvenida: "En Groupack **importas sin arriesgar** capital en inventario parado.\n\nResponde 2 preguntas sobre tu experiencia **importando** y tus ventas, y desbloquea increíbles **beneficios.**",
    mensajeExito: "1. **Bono logístico** (flete) de 400 mil pesos en tu primera importación.\n\n2. **Cotización gratis** de tus primeros 10 productos.\n\n3. Financiación de 5 millones **sujeto a restricciones.**",
    premio: { nombre: "Premio Groupack", descripcion: "1. Bono logístico (flete) de 400 mil pesos en tu primera importación\n\n2. Cotización gratis de tus primeros 10 productos\n\n3. Financiación de 5 millones sujeto a restricciones" },
    preguntas: [
      {
        texto: "¿Ya has importado antes desde china?",
        opciones: ["Si", "No"],
      },
      {
        texto: "¿Qué rango de ventas (unidades / ordenes) tuviste el último mes?",
        opciones: ["Menos de 500", "Entre 501 y 1000", "Entre 1001 y 3000", "Entre 3001 y 5000", "Más de 5000"],
      },
    ],
  },         
];

// 2.8) Punto especial de Academy, en el centro del plano.
//
// IMPORTANTE: va aparte del array STANDS a propósito. Todo el avance de la
// Ruta Winners (la barra del perfil, el contador del trofeo, el desbloqueo de
// los premios) se calcula sobre STANDS.length, así que meterlo ahí lo
// convertiría en un octavo stand obligatorio. Aquí es un punto adicional que
// no cuenta para el avance.
export const PUNTO_ACADEMY = {
  id: "academy",
  nombre: "Academy",
  x: 50,
  y: 51,
  logo: "/media/Logo_Academy.png",
  // Etiqueta pequeña arriba del nombre, para que se entienda que no es una
  // marca más de la ruta.
  kicker: "Experiencia extra",
  descripcion: "Una mini experiencia para poner a prueba lo aprendido.",
  textoBoton: "Entrar",

  // El contenido de las PANTALLAS de Academy (bienvenida, camino de
  // estaciones, etc.) ya no vive aquí: son varias pantallas con bastante
  // texto y se movió todo a src/data/academyDatos.js. Aquí queda solo lo que
  // necesita el punto del mapa.
  //
  // Versión anterior (movida a academyDatos.js -> ACADEMY.intro):
  // intro: {
  //   texto: "Hoy no vas a ver una clase,\nvas a completar una **misión.**",
  //   imagen: "/media/Codi_Academy_Sentado.png",
  //   textoBoton: "Empezar misión",
  // },
};

export const PREGUNTAS_EJEMPLO = [
  {
    texto: "¿Qué es lo que más te gustaría encontrar en un stand como este?",
    opciones: ["Descuentos exclusivos", "Demostraciones en vivo", "Contenido educativo", "Sorpresas y regalos"],
  },
  {
    texto: "¿Qué tan probable es que recomiendes esta marca a un colega?",
    opciones: ["Muy probable", "Probable", "Tal vez", "Poco probable"],
  },
];

// 5) Fecha simulada para PROBAR la validación de "día correcto" del check-in
//    sin esperar a la fecha real ni tocar el reloj del celular. Ejemplo:
//    export const FECHA_SIMULADA_HOY = "2026-07-25"; // hace que la app crea que hoy es Día 1
//    Déjalo en null para usar la fecha real del dispositivo (esto es lo que
//    debe quedar antes del evento real).
export const FECHA_SIMULADA_HOY = null;
