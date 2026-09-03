/* ============================================================
   academyDatos.js — contenido de las pantallas de Academy.

   Academy no es "una marca más" de la Ruta Winner: es una mini
   experiencia con varias pantallas propias (bienvenida, camino de
   estaciones, y las que vengan). Por eso su contenido vive aquí y no
   en config.js, que quedó solo con el punto del mapa (posición,
   kicker, descripción y texto del botón del popup).

   Igual que en config.js, los textos aceptan **negrillas** y \n para
   saltos de línea: los procesa el helper conNegrillas().
   ============================================================ */

export const ACADEMY = {
  nombre: 'Academy',
  logo: '/media/Logo_Academy.png',
  // Versión naranja del logo, para las pantallas de fondo claro (el blanco
  // se perdería). Las pantallas de misión eligen una u otra según el `fondo`
  // del paso.
  logoNaranja: '/media/Logo_Academy_Naranja.png',

  // ---- Pantalla 1: bienvenida ----
  intro: {
    texto: 'Hoy no vas a ver una clase,\nvas a completar una **misión.**',
    // PENDIENTE: reemplazar por el PNG del Codi sentado con destellos que
    // entregue diseño. Mientras tanto se usa el que ya está en el proyecto
    // para no dejar el hueco.
    imagen: '/media/Codi_Academy_Sentado.png',
    textoBoton: 'Empezar misión',
  },

  // ---- Pantalla 2: el camino de estaciones ----
  camino: {
    titulo: '¡Comienza tu camino\nhacia el **premio!**',
    imagen: '/media/Codi_Academy_Celebra.png',

    // Las tres estaciones del camino. En la pantalla se dibujan como paneles
    // apilados, y cada uno se abre y se cierra por separado.
    //
    // `texto` acepta **negrillas**; `imagen` es la ilustración que acompaña
    // al texto cuando el panel está abierto.
    // `icono`: SVG/PNG propio de la estación (opcional). Mientras diseño
    // entregue los definitivos se deja en null y la pantalla usa el icono
    // según el estado: candado si está bloqueada, chulo si está completada y
    // el QR si es la que toca hacer.
    estaciones: [
      {
        id: 'rentabilidad',
        nombre: 'Laboratorio de Rentabilidad',
        texto: 'Aprende a calcular si un producto realmente **deja ganancias.**',
        textoBoton: 'Comencemos',
        // PENDIENTE: ilustración de la referencia (el mapa con el pin).
        // Sugerido: /media/Academy_Rentabilidad.png
        imagen: null,
        icono: '/media/Calculadora.svg',

        // Los costos que no dependen del producto: el flete y el CPA en Meta
        // Ads, los dos promedios. Van acá y no en cada producto para no
        // repetirlos cuatro veces (y para cambiarlos en un solo lugar).
        costos: {
          etiquetaProducto: 'Costo de producto',
          fijos: [
            { etiqueta: 'Costo del CPA', valor: 15000 },
            { etiqueta: 'Costo del envío', valor: 18000 },
          ],
        },

        // Los pasos de la misión, en orden. Cada paso tiene un `tipo` y la
        // pantalla lo dibuja según ese tipo, así se pueden ir agregando pasos
        // nuevos sin tocar la navegación:
        //   - 'seleccionProducto': grilla de productos para elegir uno.
        // `avance` es lo que marca la barra de arriba en ese paso (0 a 1).
        pasos: [
          {
            id: 'seleccion',
            tipo: 'seleccionProducto',
            fondo: 'claro',
            avance: 0.2,
            imagen: '/media/Codi_Academy_Busca.png',
            titulo: 'Selecciona tu\n**Producto a vender**',
            textoBotonProducto: 'Vender con Dropi',
            // Las imágenes que entregó diseño ya vienen con la tarjeta
            // completa (foto + corazón), así que la pantalla las muestra tal
            // cual y no dibuja el corazón por separado.
            //
            // De cada producto solo se guardan dos números:
            //   `precioProveedor`: lo que cobra el proveedor por el producto.
            //   `precioMercado`: a cómo lo vende la competencia. NO es un
            //      costo, es la referencia para saber si se es competitivo.
            // Los otros dos costos (flete y CPA) son promedios iguales para
            // todos y viven en `costos.fijos` de la estación, y el total y las
            // zonas de precio los calcula src/utils/rentabilidad.js.
            //
            // PENDIENTE: los nombres reales de los productos (por ahora solo
            // se usan como texto alternativo de la imagen) y el
            // `precioProveedor` real de los productos 2, 3 y 4: los de abajo
            // están puestos guardando la misma proporción del producto 1
            // (costo total ≈ 80% del precio de mercado) para que las cinco
            // zonas queden en orden y la pantalla se pueda probar.
            productos: [
              {
                id: 'producto-1',
                nombre: 'Producto 1',
                imagen: '/media/Producto_1.png',
                precioProveedor: 35000,
                precioMercado: 84900,
              },
              {
                id: 'producto-2',
                nombre: 'Producto 2',
                imagen: '/media/Producto_2.png',
                precioProveedor: 14900, // PENDIENTE
                precioMercado: 59900, // PENDIENTE
              },
              {
                id: 'producto-3',
                nombre: 'Producto 3',
                imagen: '/media/Producto_3.png',
                precioProveedor: 62900, // PENDIENTE
                precioMercado: 119900, // PENDIENTE
              },
              {
                id: 'producto-4',
                nombre: 'Producto 4',
                imagen: '/media/Producto_4.png',
                precioProveedor: 86900, // PENDIENTE
                precioMercado: 149900, // PENDIENTE
              },
            ],
          },

          {
            id: 'precio',
            tipo: 'definirPrecio',
            // Esta pantalla va sobre naranja, no sobre blanco como la anterior.
            fondo: 'naranja',
            // En la referencia esta pantalla no muestra la barra de avance ni
            // a Codi. Si se quieren, basta poner aquí `avance: 0.4` y una
            // `imagen`.
            avance: null,
            titulo: 'Ahora define tu precio de venta',
            subtitulo: 'Conoce tus costos y compáralos con el precio del mercado.',
            // La etiqueta de la píldora de la tarjeta del producto elegido.
            // Acá es solo un recordatorio, no un botón.
            textoBotonProducto: 'Vender con Dropi',
            tituloResumen: 'Resumen de Rentabilidad',
            textoResumen: 'Estos son los costos **que debes** cubrir antes de obtener ganancias.',
            // Renglón de referencia del mercado (no suma al total).
            etiquetaMercado: 'Precio de mercado',
            etiquetaTotal: 'Total de costos',
            pregunta: '¿A qué precio venderías este producto?',
            ayuda: 'Ingresa un precio y descubre qué tan rentable sería.',
            placeholderPrecio: '$80.000',
            textoBoton: 'Analizar mi precio',
          },

          {
            id: 'analisis',
            tipo: 'analisisPrecio',
            // La parte de arriba va sobre blanco y la escala de abajo sobre
            // naranja; ese corte lo hace la propia pantalla.
            fondo: 'claro',
            avance: null,
            imagen: '/media/Codi_Academy_Gana.png',
            etiquetaPrecio: 'Venderías a:',
            etiquetaCostos: 'Tus costos:',
            etiquetaGanancia: 'Ganancia por venta:',
            etiquetaMargen: 'Margen:',
            etiquetaCompetencia: 'Precio competencia:',
            // {diferencia} lo reemplaza la pantalla por la plata que separa
            // el precio del de la competencia (la brecha vs mercado).
            textoDebajo: 'Estás {diferencia} por debajo de la competencia y',
            textoEncima: 'Estás {diferencia} por encima de la competencia y',
            textoIgual: 'Estás al mismo precio de la competencia y',
            tituloEscala: '¿Dónde está tu precio de venta?',
            // Las etiquetas de las cinco zonas de la escala. Los techos de
            // cada zona NO se escriben acá: los calcula rentabilidad.js a
            // partir del costo total y del precio de la competencia.
            etiquetasZonas: {
              perdida: 'Pérdida',
              minimo: 'Margen bajo',
              rentable: 'Rentable',
              espejo: 'Competencia',
              premium: 'Premium',
            },
            // Este botón no está en la referencia; está para que la pantalla
            // tenga salida hacia el paso siguiente. Si se borra de acá, la
            // pantalla deja de dibujarlo.
            textoBoton: 'Continuar',

            // Un veredicto por zona. `frase` es el remate corto que cierra la
            // comparación con la competencia (va en negrilla) y `detalle` es
            // la explicación de por qué esa zona es buena o mala.
            //
            // 'equilibrio' no aparece en la escala porque no es una zona sino
            // un punto exacto: el precio justo igual al costo total.
            veredictos: {
              perdida: {
                titulo: '¡Ojo con ese precio!',
                frase: 'estás perdiendo plata por pedido.',
                detalle: 'Por debajo de tu costo total, cada venta te cuesta dinero en vez de dejarte ganancia.',
              },
              equilibrio: {
                titulo: 'Punto de equilibrio',
                frase: 'no pierdes, pero tampoco ganas nada.',
                detalle: 'Estás vendiendo justo a lo que te cuesta. Es insostenible: cualquier devolución o gasto extra te pone en rojo.',
              },
              minimo: {
                titulo: 'Margen muy justo',
                frase: 'tu ganancia queda demasiado ajustada.',
                detalle: 'Técnicamente es rentable, pero sin colchón para errores, devoluciones ni para escalar la pauta.',
              },
              rentable: {
                titulo: '¡Buen precio!',
                frase: 'tienes un margen saludable.',
                detalle: 'La zona ideal: tienes margen real y sigues siendo más barato que la competencia.',
              },
              espejo: {
                titulo: 'Precio espejo',
                frase: 'estás al mismo precio del mercado.',
                detalle: 'Acá no compites por precio, compites por percepción de valor.',
              },
              premium: {
                titulo: 'Precio premium',
                frase: 'te toca justificar por qué cuestas más.',
                detalle: 'Solo funciona si tienes diferenciación clara: mejor garantía, más velocidad o mejor marca. Sin eso, pierdes volumen.',
              },
            },
          },
        ],
      },
      {
        id: 'logistica',
        nombre: 'Ruta Logística',
        texto: 'Encuentra la transportadora perfecta',
        textoBoton: 'Comencemos',
        imagen: null,
        icono: '/media/Camion.svg',

        // Las transportadoras viven en la estación y no en un paso porque las
        // usan dos pantallas: la de estadísticas y la de ordenarlas.
        // `cobertura` es el porcentaje y se muestra con el % puesto por la
        // pantalla; `flete` es el valor en pesos y se formatea igual que el
        // resto de la plata del proyecto.
        // PENDIENTE: el icono propio de cada transportadora (si lo hay). Con
        // `icono` en null se usa el camión para todas.
        transportadoras: [
          { id: 't1', nombre: 'Transportadora 1', icono: null, cobertura: 90, efectividad: 'Media', flete: 18000 },
          { id: 't2', nombre: 'Transportadora 2', icono: null, cobertura: 83, efectividad: 'Alta', flete: 25000 },
          { id: 't3', nombre: 'Transportadora 3', icono: null, cobertura: 67, efectividad: 'Media', flete: 16000 },
          { id: 't4', nombre: 'Transportadora 4', icono: null, cobertura: 40, efectividad: 'Alta', flete: 14000 },
          { id: 't5', nombre: 'Transportadora 5', icono: null, cobertura: 91, efectividad: 'Baja', flete: 12000 },
        ],

        pasos: [
          {
            id: 'portada',
            tipo: 'portada',
            // Naranja con el damero, como la pantalla del camino.
            fondo: 'damero',
            avance: null,
            // El logo va centrado y más grande en esta pantalla.
            logoCentrado: true,
            titulo: 'ELIGE TU RUTA LOGÍSTICA',
            subtitulo: 'Analiza las estadísticas de cada transportadora **y ordénalas según tu prioridad**',
            // Ojo: se llama `personaje` y no `imagen` a propósito. `imagen` es
            // el Codi que dibuja AcademyMision arriba de todo; acá el
            // personaje va entre el texto y el botón, así que lo pone la
            // propia pantalla.
            // PENDIENTE: el PNG todavía no está en public/media; la ruta queda
            // puesta tal como la definió el equipo.
            personaje: '/media/Codi_Academy_Quimica.png',
            textoBoton: 'Ver transportadoras',
          },

          {
            id: 'transportadoras',
            tipo: 'analisisTransportadoras',
            fondo: 'claro',
            avance: null,
            titulo: 'Analiza **las transportadoras**',
            etiquetaCobertura: 'Cobertura nacional',
            etiquetaEfectividad: 'Efectividad en ciudades principales:',
            etiquetaFlete: 'Costo del flete:',
            textoBoton: 'Continuar',
          },

          {
            id: 'orden',
            tipo: 'ordenarTransportadoras',
            // Gris claro arriba y una hoja blanca abajo; el corte lo hace la
            // propia pantalla.
            fondo: 'gris',
            avance: null,
            titulo: 'Ordena tus\ntransportadoras',
            instruccion: 'Ahora decide cuáles usarías primero.',
            personaje: '/media/Codi_Academy_Camion.png',
            // Queda apagado hasta que las cinco transportadoras tengan una
            // posición.
            textoBoton: 'Continuar',
          },

          {
            id: 'ranking',
            tipo: 'rankingResultado',
            fondo: 'naranja',
            avance: null,
            titulo: '¡Ranking\ncompletado!',
            // PENDIENTE: confirmar cuál Codi va acá. Se usa el sentado, que es
            // el que más se parece al de la referencia.
            personaje: '/media/Codi_Academy_Sentado.png',
            conclusion: 'No existe una única transportadora ideal. La mejor opción depende de lo que priorices:\n**cobertura, efectividad o costo.**',
            textoBoton: 'Siguiente Nivel',

            // El "orden correcto" que se le revela a la persona después de
            // haber armado el suyo. Va por `id` para no repetir los nombres,
            // que viven en estacion.transportadoras.
            // PENDIENTE: la referencia solo muestra tres. Si deben salir las
            // cinco, se agregan acá con sus puntos y su virtud.
            ranking: [
              { id: 't1', puntos: 95, virtud: 'Mejor equilibrio' },
              { id: 't2', puntos: 93, virtud: 'Mayor cobertura' },
              { id: 't3', puntos: 90, virtud: 'Mejor costo' },
            ],
          },
        ],
      },
      {
        id: 'novedades',
        nombre: 'Centro de novedades',
        // PENDIENTE: descripción real de la estación (la de las otras dos sí
        // vino en las referencias).
        texto: 'PENDIENTE: descripción de la estación.',
        textoBoton: 'Comencemos',
        imagen: null,
        icono: '/media/Lanzamiento.svg',

        pasos: [
          {
            id: 'reto',
            tipo: 'retoIntro',
            fondo: 'naranja',
            avance: null,
            logoCentrado: true,
            // El primer renglón va normal y el segundo en negrilla y más
            // grande; el tercero es la línea pequeña de abajo.
            titulo: 'Incluso los mejores vendedores\n**reciben novedades**',
            subtitulo: 'Lo importante es saber resolverlas rápido',
            personaje: '/media/Codi_Academy_Celebra.png',
            // El sobre no se dibuja con CSS: es esta imagen, hecha del tamaño
            // completo del fondo (1080x1920) para que la forma no se mueva.
            // `sobreArriba` es dónde arranca el texto dentro del sobre, en
            // porcentaje del alto de la pantalla; sale de la posición del
            // recorte en el PNG.
            fondoImagen: '/media/Sobre1.png',
            // Medido sobre el PNG: la parte crema del sobre va del 57,6% al
            // 72% del alto, así que el texto arranca justo debajo del borde.
            sobreArriba: '60%',
            tituloSobre: 'Nuevo reto disponible',
            textoSobre: 'Prepárate para resolver una situación real que puede ocurrir con un pedido.',
            textoBoton: 'Resolver novedad',
          },

          {
            id: 'caso',
            tipo: 'casoPregunta',
            fondo: 'naranja',
            avance: null,
            logoCentrado: true,
            fondoImagen: '/media/Sobre2.png',
            // En este PNG la parte crema arranca más arriba (21,9%).
            sobreArriba: '26%',
            titulo: 'Caso',
            texto: 'Tu pedido está detenido. La transportadora reporta: "DIRECCIÓN DESTINATARIO INCOMPLETA". Tu cliente solo te dio "Calle 5 # 12-30".',
            pregunta: '¿Qué harías?',
            // Selección única. `correcta` es el id de la opción buena.
            // PENDIENTE: confirmar cuál es (en la referencia aparece marcada
            // la primera, pero eso puede ser solo el estado seleccionado del
            // mockup). Mientras esté en null la pantalla no evalúa nada, solo
            // deja continuar.
            correcta: null,
            opciones: [
              { id: 'a', texto: 'Contactas al cliente y actualizas los datos de entrega.' },
              { id: 'b', texto: 'Marcas el pedido como "volver a ofrecer" para un nuevo intento.' },
              { id: 'c', texto: 'Solicitas a la transportadora un nuevo intento con la dirección registrada.' },
            ],
            textoBoton: 'Continuar',
          },

          {
            id: 'final',
            tipo: 'misionCompletada',
            fondo: 'naranja',
            avance: null,
            logoCentrado: true,
            titulo: '¡Misión Academy\ncompletada!',
            personaje: '/media/Codi_Academy_Celebra.png',
          },
        ],
      },
    ],
  },
};
