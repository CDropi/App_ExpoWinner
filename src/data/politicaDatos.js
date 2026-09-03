/* ============================================================
   
   Cada sección es:
   {
     id:        identificador corto y estable (se usa como key)
     insignia:  lo que se dibuja en el círculo del acordeón
     titulo:    el texto que se ve en la cabecera
     bloques:   el contenido, en orden
   }

   Tipos de bloque disponibles:

   { tipo: 'parrafo',   texto: '...' }
       Párrafo corrido. Admite **negrillas** con dobles asteriscos.

   { tipo: 'subtitulo', texto: '2.1 Principio de acceso...' }
       Subtítulo dentro de una sección (los 2.1, 2.2, 2.3 de la web).

   { tipo: 'lista', items: [
       { termino: 'Autorización', texto: 'Consentimiento previo...' },
       { texto: 'Un ítem sin término en negrilla.' },
     ] }
       Lista con viñetas. "termino" es opcional; cuando está, se
       dibuja en negrilla seguido de dos puntos, como en la web.
   ============================================================ */

export const POLITICA_DATOS_TITULO =
  'Política de Protección de Datos Personales – DROPI S.A.S.';

// Fecha de última actualización. Si la web no la muestra, dejar en null y
// la pantalla no dibuja la línea.
export const POLITICA_DATOS_ACTUALIZACION = null;

export const POLITICA_DATOS = [
  {
    id: 'preambulo',
    insignia: '•',
    titulo: 'Preámbulo e Introducción',
    bloques: [
      { tipo: 'parrafo', texto: 'DROPI S.A.S. en cumplimiento de lo dispuesto en la Constitución Política de Colombia y la Ley Estatutaria 1581 de 2012 y sus normas reglamentarias y complementarias, garantiza de forma integral la protección y el ejercicio del derecho fundamental de Habeas Data de todos los titulares de la información de carácter personal, de la cual sea responsable o encargado de su tratamiento. Asimismo, garantizará en todo momento los derechos fundamentales a la intimidad, el buen nombre y la privacidad de las personas físicas, razón por la cual adopta y aplica la presente Política de Protección de Datos Personales.' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. en calidad de responsable de tratamiento de información personal, informa a los usuarios, afiliados, inscritos, clientes, beneficiarios, colaboradores, contratistas y/o proveedores, entre otros, que hayan facilitado o que en el futuro faciliten sus datos personales, que los mismos serán incluidos en sus bases de datos y que serán objeto de inscripción ante el Registro Nacional de Bases de Datos que administra la Superintendencia de Industria y Comercio, y serán tratados conforme a lo estipulado en la presente política.' },
      { tipo: 'parrafo', texto: 'Por todo lo anterior, DROPI S.A.S. se declara responsable de la presente política y del tratamiento de protección de datos que en sus actividades desarrolle frente a las personas naturales titulares de datos de carácter personal. Domicilio: KR 65 # 9 – 86, Cali – Valle del Cauca.' },
      { tipo: 'subtitulo', texto: 'Introducción' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. es una persona jurídica constituida como sociedad comercial, mediante el documento privado del 09 de junio de 2020 de Cali, inscrita en la Cámara de Comercio el 03 de septiembre de 2020 con el No. 11849 del Libro IX, que ha decidido adoptar de forma voluntaria la presente política, la cual establece las condiciones de organización, obligaciones de los implicados e intervinientes en el tratamiento y uso de la información de carácter personal, régimen de funcionamiento y procedimientos aplicables al tratamiento de datos personales que en el desarrollo de sus actividades propias tenga que solicitar, utilizar, almacenar, corregir, ceder o suprimir.' },
      { tipo: 'parrafo', texto: 'Lo anterior ha sido resuelto con el fin de dar pleno cumplimiento a lo dispuesto por la Constitución Política de Colombia, la Ley 1581 de 2012, así como las demás normas que reglamentan y complementan el tratamiento para la Protección de Datos Personales en Colombia.' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. es el responsable del tratamiento de Datos Personales y, en cumplimiento a lo establecido en el artículo 13 del Decreto Reglamentario 1377 de 2013, hace público a todos los interesados la presente política que contiene todos los elementos esenciales, sencillos y seguros para el cumplimiento de la legislación correspondiente a la Protección de Datos Personales.' },
      { tipo: 'parrafo', texto: 'Los datos administrados o tratados por DROPI S.A.S. son de naturaleza privada, de naturaleza pública, datos sensibles y datos de menores de edad, donde las bases de datos se encuentran sujetas a todas y cada una de las obligaciones que dispone la Ley 1581 de 2012, los Decretos Reglamentarios y las demás normas que lo complementen, adicionen o deroguen, en materia de Protección de Datos Personales.' },
    ],
  },
  {
    id: 'definiciones',
    insignia: '1',
    titulo: 'Definiciones',
    bloques: [
      {
        tipo: 'lista',
        items: [
          { termino: 'Aviso de privacidad', texto: 'Comunicación verbal o escrita generada por el responsable, dirigida al titular para el tratamiento de sus datos personales, mediante la cual se le informa acerca de la existencia de las políticas de tratamiento de información que le serán aplicables, la forma de acceder a las mismas y las finalidades del tratamiento que se pretende dar a los datos personales.' },
          { termino: 'Autorización', texto: 'Consentimiento previo, expreso e informado del titular de los datos personales para llevar a cabo el tratamiento de los datos personales.' },
          { termino: 'Base de datos', texto: 'Conjunto organizado de datos personales que sean objeto de Tratamiento.' },
          { termino: 'Dato personal', texto: 'Cualquier información vinculada o que pueda asociarse a una o a varias personas naturales determinadas o determinables. Debe entonces entenderse el "dato personal" como una información relacionada con una persona natural (persona individualmente considerada).' },
          { termino: 'Dato personal privado', texto: 'Toda información personal que tiene un conocimiento restringido, y en principio privado para el público en general.' },
          { termino: 'Dato personal público', texto: 'Es el dato que no sea semiprivado, privado o sensible. Son considerados datos personales públicos, entre otros, los datos relativos al estado civil de las personas, a su profesión u oficio y a su calidad de comerciante o de servidor público. Por su naturaleza, los datos públicos pueden estar contenidos, entre otros, en registros públicos, documentos públicos, gacetas y boletines oficiales, y sentencias judiciales debidamente ejecutoriadas que no estén sometidas a reserva.' },
          { termino: 'Dato personal semiprivado', texto: 'Es semiprivado el dato que no tiene naturaleza íntima, reservada, ni pública y cuyo conocimiento o divulgación puede interesar no sólo a su titular sino a cierto sector o grupo de personas o a la sociedad en general.' },
          { termino: 'Dato sensible', texto: 'Aquel dato que afecta la intimidad del Titular o cuyo uso indebido puede generar su discriminación, tales como aquellos que revelen el origen racial o étnico, la orientación política, las convicciones religiosas o filosóficas, la pertenencia a sindicatos, organizaciones sociales, de derechos humanos o que promueva intereses de cualquier partido político o que garanticen los derechos y garantías de partidos políticos de oposición, así como los datos relativos a la salud, a la vida sexual y los datos biométricos.' },
          { termino: 'Encargado del tratamiento', texto: 'DROPI S.A.S. actúa como encargado del tratamiento de datos personales en los casos en que, por sí mismo o en asocio con otros, realice el tratamiento de datos personales por cuenta de un responsable del tratamiento.' },
          { termino: 'Responsable del tratamiento', texto: 'DROPI S.A.S. actúa como responsable del tratamiento de datos personales frente a todos los datos personales sobre los cuales decida directamente, en cumplimiento de las funciones propias reconocidas legalmente.' },
          { termino: 'Titular', texto: 'Persona natural cuyos datos personales sean objeto de Tratamiento.' },
          { termino: 'Transferencia', texto: 'La transferencia de datos tiene lugar cuando el responsable y/o encargado del tratamiento de datos personales, ubicado en Colombia, envía la información o los datos personales a un receptor, que a su vez es responsable del tratamiento y se encuentra dentro o fuera del país.' },
          { termino: 'Transmisión', texto: 'Tratamiento de datos personales que implica la comunicación de los mismos dentro o fuera del territorio de la República de Colombia cuando tenga por objeto la realización de un tratamiento por el encargado por cuenta del responsable.' },
          { termino: 'Tratamiento', texto: 'Cualquier operación o conjunto de operaciones que DROPI S.A.S. realice sobre datos de carácter personal tales como la recolección, procesamiento, publicidad, almacenamiento, uso, circulación o supresión. Lo anterior solo aplicará exclusivamente para la información de personas naturales.' },
        ],
      },
    ],
  },
  {
    id: 'principios',
    insignia: '2',
    titulo: 'Principios para el Tratamiento de Datos Personales',
    bloques: [
      { tipo: 'parrafo', texto: 'Para dar cumplimiento a la Política de Protección de Datos Personales, como a las obligaciones impartidas por la Ley 1581 de 2012 y su Decreto reglamentario, los datos personales de naturaleza privada y pública, así como los datos sensibles y de menores, son manejados y tratados por DROPI S.A.S. bajo los siguientes principios:' },
      {
        tipo: 'lista',
        items: [
          { termino: 'Acceso y Circulación', texto: 'De acuerdo con las disposiciones legales, los datos que trata DROPI S.A.S. tendrán acceso y circulación restringida acorde con la naturaleza del dato y con las autorizaciones dadas por el Titular o demás personas previstas en la Ley.' },
          { termino: 'Confidencialidad', texto: 'Se garantiza la confidencialidad de los datos dependiendo de la naturaleza del mismo. Por lo tanto, se guardará reserva de la información durante y después de terminadas las actividades que justifican el tratamiento de los datos personales.' },
          { termino: 'Finalidad', texto: 'Legítima, informada, temporal y material. La finalidad siempre corresponderá a las actividades propias de DROPI S.A.S. o aquellas que se deriven de las obligaciones legales que se deban cumplir en el desarrollo del objeto social.' },
          { termino: 'Legalidad', texto: 'Fines legítimos y sujetos a la Ley 1581 de 2012.' },
          { termino: 'Libertad', texto: 'DROPI S.A.S. garantiza el derecho a la autodeterminación informativa de los titulares que suministren datos de carácter personal.' },
          { termino: 'Seguridad', texto: 'Medidas técnicas, humanas y administrativas necesarias para evitar adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.' },
          { termino: 'Transparencia', texto: 'DROPI S.A.S. garantiza a los titulares de datos personales el derecho de acceso y conocimiento de la información de carácter personal que esté siendo tratada conforme a lo establecido por la normatividad vigente.' },
          { termino: 'Veracidad o Calidad', texto: 'Información veraz, completa, exacta, actualizada, comprobable y comprensible.' },
        ],
      },
      { tipo: 'subtitulo', texto: '2.1 Principio de acceso y circulación restringida' },
      { tipo: 'parrafo', texto: 'El tratamiento se sujeta a los límites que se derivan de la naturaleza de los datos personales, de las disposiciones de la presente política, de la Ley y la Constitución. En este sentido, el tratamiento sólo podrá hacerse por personas autorizadas por el Titular y/o por las personas previstas por ley.' },
      { tipo: 'parrafo', texto: 'Los datos personales, excepto aquellos de naturaleza pública, no podrán estar disponibles en Internet u otros medios de divulgación o comunicación masiva, salvo que el acceso sea técnicamente controlable para brindar un conocimiento restringido a los Titulares o terceros autorizados. Para estos propósitos, la obligación de DROPI S.A.S. será de medio y no de resultado.' },
      { tipo: 'subtitulo', texto: '2.2 Principio de confidencialidad' },
      { tipo: 'parrafo', texto: 'Todas las personas que intervengan en el tratamiento de datos personales que no tengan la naturaleza de públicos, están obligadas a garantizar la reserva de la información, inclusive después de finalizada su relación con alguna de las labores que comprende el tratamiento, pudiendo sólo suministrar o comunicar los datos personales cuando ello corresponda al desarrollo de las actividades autorizadas en la Ley y en los términos de la misma.' },
      { tipo: 'parrafo', texto: 'En consecuencia, se comprometen a conservar y mantener de manera estrictamente confidencial y no revelar a terceros la información personal, contable, técnica, comercial o de cualquier otro tipo suministrada en la ejecución y ejercicio de las actividades. Todas las personas que trabajen actualmente o sean vinculadas a futuro para tal efecto, en la administración y manejo de bases de datos, deberán suscribir un documento adicional u otrosí a su contrato laboral o de prestación de servicios para efectos de asegurar tal compromiso. Esta obligación persiste y se mantiene inclusive después de finalizada su relación con alguna de las labores que comprende el Tratamiento.' },
      { tipo: 'subtitulo', texto: '2.3 Principio de finalidad' },
      { tipo: 'parrafo', texto: 'El Tratamiento de datos personales que DROPI S.A.S. realiza obedece a la finalidad legítima de acuerdo con la Constitución Política, la Ley 1581 de 2012 y el Decreto 1377 de 2013, y a su vez con aquello que implique el desarrollo legal de las actividades de la empresa.' },
      { tipo: 'subtitulo', texto: '2.4 Principio de legalidad' },
      { tipo: 'parrafo', texto: 'El Tratamiento de Datos Personales es una actividad reglada que se rige por la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 y demás normatividad que las complementen, modifiquen o deroguen.' },
      { tipo: 'subtitulo', texto: '2.5 Principio de libertad' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. puede tratar y ceder los datos personales que se encuentren almacenados en sus bases de datos, sin el previo consentimiento del titular, siempre y cuando estos provengan de una fuente de acceso público, sean de naturaleza pública o se encuentren en bases de datos excluidas por la Ley (p.ej. periodísticas, estadísticas y para la investigación). En los demás casos, DROPI S.A.S. deberá obtener el consentimiento previo, expreso e informado del Titular al momento de tratar sus datos personales.' },
      { tipo: 'subtitulo', texto: '2.6 Principio de seguridad' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. como responsable y/o encargado del tratamiento de datos de carácter personal, proporciona las medidas técnicas, humanas y administrativas que sean necesarias para otorgar seguridad a las bases de datos, evitando su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.' },
      { tipo: 'subtitulo', texto: '2.7 Principio de transparencia' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. garantiza a las personas naturales titulares de datos personales que podrán obtener en cualquier momento, gratuitamente y sin restricciones, información acerca de la existencia de datos que le conciernan y que estén almacenados en las bases de datos de la compañía, bajo los parámetros establecidos en el artículo 21 del Decreto Reglamentario 1377 de 2013 y demás normas que lo adicionen o complementen.' },
      { tipo: 'subtitulo', texto: '2.8 Principio de veracidad o calidad' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. garantiza que la información contenida en las bases de datos que estén sujetas a tratamiento serán veraces, completas, exactas, actualizadas, comprobables y comprensibles. La veracidad y calidad de los datos personales que hayan sido capturados es garantizada por cada uno de los titulares de la misma cuando ha suministrado los datos, quedando eximida de cualquier tipo de responsabilidad DROPI S.A.S. frente a su calidad.' },
    ],
  },
  {
    id: 'tratamiento-finalidades',
    insignia: '3',
    titulo: 'Tratamiento de Datos Personales y Finalidades',
    bloques: [
      { tipo: 'subtitulo', texto: '3.1 Tratamiento de datos públicos' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. advierte que trata sin previa autorización del Titular los datos personales de naturaleza pública y aquellos que provengan de una fuente de acceso público. Esta situación no implica que no se adopten las medidas necesarias que garanticen el cumplimiento de los otros principios y obligaciones contempladas en la Ley 1581 de 2012 y demás normas que regulen esta materia.' },
      { tipo: 'subtitulo', texto: '3.2 Tratamiento de datos privados y semiprivados' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. tratará datos personales privados y semiprivados cuando existe autorización previa para ello y estrictamente para la finalidad con la cual se recolectó el dato y de la cual se le informó al Titular al momento de recaudarlo. Esto ha conllevado a adoptar medidas técnicas y administrativas necesarias para garantizar la seguridad y la veracidad en la información, a partir de lo cual, entre otras, se hace posible su recopilación, almacenamiento, uso, segmentación, comercialización, transferencia y supresión.' },
      { tipo: 'subtitulo', texto: '3.3 Tratamiento de datos sensibles' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. solo trata datos personales sensibles para lo estrictamente necesario, solicitando consentimiento previo y expreso a los titulares e informándoles sobre la finalidad exclusiva para su tratamiento. DROPI S.A.S. utiliza y trata datos catalogados como sensibles cuando:' },
      {
        tipo: 'lista',
        items: [
          { texto: 'El tratamiento haya sido autorizado expresamente por el Titular de los datos sensibles, salvo en los casos que, por Ley, no se requiera el otorgamiento de dicha autorización.' },
          { texto: 'El Tratamiento sea necesario para salvaguardar el interés vital del titular y éste se encuentre física o jurídicamente incapacitado. En estos eventos, los representantes legales deberán otorgar la autorización.' },
          { texto: 'El Tratamiento se refiera a datos que sean necesarios para el reconocimiento, ejercicio o defensa de un derecho en un proceso judicial.' },
          { texto: 'El Tratamiento tenga una finalidad histórica, estadística o científica, siempre y cuando se adopten las medidas conducentes a la supresión de identidad de los Titulares o el dato esté disociado.' },
        ],
      },
      { tipo: 'parrafo', texto: 'En adición a lo anterior, DROPI S.A.S. cumple con las siguientes obligaciones:' },
      {
        tipo: 'lista',
        items: [
          { texto: 'Informar al titular que por tratarse de datos sensibles no está obligado a autorizar su tratamiento.' },
          { texto: 'Informar al titular de forma explícita y previa cuáles datos son de carácter sensible y la finalidad del tratamiento, y obtener el consentimiento expreso.' },
          { texto: 'No condicionar ninguna actividad a que el titular suministre datos personales sensibles (salvo que exista una causa legal o contractual para hacerlo).' },          
        ],
      },
      { tipo: 'subtitulo', texto: '3.4 Tratamiento de datos de menores' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. trata datos personales de menores de edad cuando provienen de la información suministrada con autorización de los padres o representantes legales. Sin embargo, el tratamiento de los datos de menores se circunscribe a lo estrictamente necesario, de conformidad con lo establecido en el artículo 7 de la Ley 1581 de 2012, y cuando el tratamiento cumpla con los siguientes parámetros:' },
      {
        tipo: 'lista',
        items: [
          { texto: 'Que responda y respete el interés superior de los niños, niñas y adolescentes.' },
          { texto: 'Que se asegure el respeto de sus derechos fundamentales.' },
          { texto: 'Que los datos de menores sean de naturaleza pública.' },          
        ],
      },
      { tipo: 'parrafo', texto: 'Cumplidos los anteriores requisitos, DROPI S.A.S. exigirá al representante legal o tutor del niño, niña o adolescente la autorización para el tratamiento, previo a que el menor dé su opinión frente al tratamiento que se le dará a sus datos.' },
      { tipo: 'parrafo', texto: 'Los datos de los menores se recolectan con el propósito de identificarlos y mantener con ellos una relación publicitaria, educativa, formativa, informativa y/o recreativa.' },
      { tipo: 'subtitulo', texto: '3.5 Finalidades del tratamiento' },
      { tipo: 'parrafo', texto: 'Los datos recolectados por DROPI S.A.S. a través de sus diferentes canales transaccionales son tratados, entre otras, bajo las siguientes finalidades:' },
      {
        tipo: 'lista',
        items: [
          { texto: 'Desarrollar, registrar, controlar y monitorear las actividades y procedimientos administrativos, operativos y comerciales propios del funcionamiento, desarrollo y consolidación de DROPI S.A.S.' },
          { texto: 'Llevar a cabo las actividades logísticas y complementarias necesarias para la prestación de los servicios: comercio electrónico de bienes, compra, venta, procesamiento, almacenamiento, distribución y mercadeo de productos, importación y exportación, outsourcing, entre otros.' },
          { texto: 'Gestionar la investigación y demás actividades asociadas y complementarias.' },
          { texto: 'Compartir o suministrar a terceros información expresamente requerida o autorizada por el titular para el desarrollo de actividades complementarias.' },
          { texto: 'Atender las exigencias legales y requerimientos de información de las autoridades administrativas y judiciales.' },
          { texto: 'Registrar, documentar y alimentar la información general y estadística de DROPI S.A.S. para el desarrollo de actividades de analítica e inteligencia de negocio.' },
          { texto: 'Emitir certificaciones solicitadas por los titulares de información, padres de familia, representantes legales, autoridades administrativas o judiciales y terceros autorizados.' },
          { texto: 'Realizar gestiones de mercadeo exclusivamente relacionadas con la promoción de los servicios comerciales de DROPI S.A.S.' },
          { texto: 'Formalizar los actos jurídicos, vínculos contractuales y garantías necesarias para el perfeccionamiento de las actividades comerciales desarrolladas por la sociedad.' },
          { texto: 'Compartir datos personales con terceros, aliados o proveedores, contratistas para el desarrollo de las actividades comerciales y sociales y demás gestiones asociadas.' },
          { texto: 'Permitir la realización de auditorías internas para monitorear y evaluar el cumplimiento de las políticas y procedimientos de protección de datos personales y seguridad informática.' },
          { texto: 'Permitir la creación de casos o usuarios en los sistemas de información de DROPI S.A.S., asociados al proceso de vinculación de proveedores o contratistas.' },
          { texto: 'Recopilar, documentar, analizar y verificar información relacionada con el perfil de los trabajadores para verificar su correspondencia con las exigencias y requisitos del cargo a proveer.' },
          { texto: 'Archivar y conservar bajo adecuadas condiciones de seguridad la información requerida para alimentar el archivo histórico de DROPI S.A.S. durante el término de vigencia legalmente aplicable.' },
          { texto: 'Controlar, monitorear, evaluar, registrar y actualizar las actividades y obligaciones propias de la elaboración, seguimiento y reporte de indicadores de gestión de sus empleados.' },
          { texto: 'Gestionar, facilitar y/o cumplir con las obligaciones del régimen laboral y de seguridad social (afiliación ante ARL, EPS, AFP, parafiscales, entre otros).' },
          { texto: 'Recolectar, almacenar, actualizar, monitorear y compartir la información médica y de salud ocupacional del trabajador desde el momento de su ingreso.' },
          { texto: 'Registrar, monitorear y gestionar información personal de los trabajadores que tenga incidencia directa en el ámbito laboral, tales como incapacidades médicas, licencias o permisos especiales de ley.' },
          { texto: 'Realizar actividades de facturación, gestión de cobranza, recaudo, soporte técnico, mejoramiento del servicio, verificaciones, control y prevención de fraude, así como cualquier otra relacionada con productos y servicios para el cumplimiento de las obligaciones contractuales de DROPI S.A.S.' },
          { texto: 'Cualquier otra finalidad acorde con la naturaleza de cada uno de los escenarios de tratamiento de DROPI S.A.S., siempre que se ciña a los límites y requisitos constitucionales y legales aplicables.' },
        ],
      },
      { tipo: 'subtitulo', texto: '3.6 Clasificación de las bases de datos' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. ha clasificado sus Bases de Datos de la siguiente manera:' },
      {
        tipo: 'lista',
        items: [
          { termino: '3.6.1 Bases de datos con información pública', texto: 'Contienen datos obtenidos de una fuente de acceso público o que por su naturaleza son datos públicos.' },
          { termino: '3.6.2 Base de datos de la Asamblea general de Accionistas', texto: 'Contienen datos de las personas naturales que hacen parte de la Asamblea general de Accionistas de DROPI S.A.S. para cumplir con las disposiciones legales y reglamentarias. Incluye datos personales públicos, privados y sensibles.' },
          { termino: '3.6.3 Bases de datos de Empleados', texto: 'Contienen datos de las personas naturales vinculadas laboralmente con DROPI S.A.S. para cumplir con las disposiciones legales y reglamentarias. Incluye información privada, pública, datos sensibles y de menores.' },
          { termino: '3.6.4 Bases de datos de Contratistas', texto: 'Contienen datos de las personas naturales que mantienen un vínculo contractual y/o comercial. Incluye datos personales públicos, privados y sensibles con finalidad el desarrollo de relaciones contractuales.' },
          { termino: '3.6.5 Base de datos de proveedores', texto: 'Contienen datos de personas naturales o jurídicas que mantienen un vínculo contractual o de prestación de servicios. Incluye datos personales públicos, privados y sensibles.' },
          { termino: '3.6.6 Bases de datos con Información General', texto: 'Contienen información de carácter personal que no sea pública, sensible, ni de menores. Serán de carácter ocasional para el cumplimiento de finalidades específicas de DROPI S.A.S.' },
          { termino: '3.6.7 Bases de datos de archivos Inactivos', texto: 'Contienen archivos o información de carácter personal inactiva, recolectada a lo largo de la vida de DROPI S.A.S. Su administración y conservación tendrá el término de permanencia establecido en las Tablas de Retención Documental indicadas por el Archivo General de la Nación.' },          
        ],
      },
    ],
  },
  {
    id: 'derechos-titulares',
    insignia: '4',
    titulo: 'Prerrogativas y Derechos de los Titulares',
    bloques: [
      { tipo: 'parrafo', texto: 'DROPI S.A.S. reconoce y garantiza a los titulares de los datos personales los siguientes derechos fundamentales:' },
      {
        tipo: 'lista',
        items: [
          { texto: 'Acceder, conocer, actualizar y rectificar sus datos personales frente a DROPI S.A.S. en su condición de responsable del Tratamiento de datos personales.' },
          { texto: 'Solicitar prueba de la existencia de la autorización otorgada a DROPI S.A.S., salvo los casos en los que la Ley exceptúa la autorización.' },
          { texto: 'Recibir información por parte de DROPI S.A.S., previa solicitud, respecto del uso que les ha dado a sus datos personales.' },
          { texto: 'Presentar quejas por infracciones a lo dispuesto en la normatividad vigente ante la Superintendencia de Industria y Comercio (SIC).' },
          { texto: 'Modificar y/o revocar la autorización y/o solicitar la supresión de los datos personales, cuando en el Tratamiento no se respeten los principios, derechos y garantías constitucionales y legales vigentes. Este Derecho de revocatoria no es absoluto siempre y cuando exista una obligación legal o contractual que limite este Derecho.' },
          { texto: 'Tener conocimiento y acceder en forma gratuita a sus datos personales que hayan sido objeto de tratamiento.' },
        ],
      },
      { tipo: 'parrafo', texto: 'Nota: Estos derechos solamente se reconocen y garantizan sobre los datos de carácter personal de las personas naturales.' },
    ],
  },
  {
    id: 'deberes-dropi',
    insignia: '5',
    titulo: 'Deberes de DROPI S.A.S. en Relación con el Tratamiento de los Datos Personales',
    bloques: [
      { tipo: 'parrafo', texto: 'DROPI S.A.S. es consciente que los datos personales son de propiedad de las personas a las que se refieren y solamente ellas pueden decidir sobre los mismos. DROPI S.A.S. hará uso de dichos datos solamente en cumplimiento de las finalidades para las que se encuentra debidamente facultada y autorizada, en todo momento respetando la normatividad vigente sobre Protección de Datos Personales.' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. como Responsable o Encargada del tratamiento de datos personales, cumple los deberes y obligaciones previstas en el artículo 17 de la Ley 1581 de 2012, a saber:' },
      {
        tipo: 'lista',
        items: [
          { texto: 'Garantizar al Titular, en todo tiempo, el pleno y efectivo ejercicio del derecho de hábeas data.' },
          { texto: 'Solicitar y conservar, en las condiciones previstas en la ley, copia de la respectiva autorización otorgada por el Titular.' },
          { texto: 'Informar debidamente al Titular sobre la finalidad de la recolección y los derechos que le asisten por virtud de la autorización otorgada.' },
          { texto: 'Conservar la información bajo las condiciones de seguridad necesarias para impedir su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.' },
          { texto: 'Garantizar que la información que se suministre al Encargado del Tratamiento sea veraz, completa, exacta, actualizada, comprobable y comprensible.' },
          { texto: 'Actualizar la información, comunicando de forma oportuna al Encargado del Tratamiento todas las novedades respecto de los datos que previamente le haya suministrado.' },
          { texto: 'Rectificar la información cuando sea incorrecta y comunicar lo pertinente al Encargado del Tratamiento.' },
          { texto: 'Suministrar al Encargado del Tratamiento únicamente datos cuyo Tratamiento esté previamente autorizado de conformidad con lo previsto en la ley.' },
          { texto: 'Exigir al Encargado del Tratamiento en todo momento el respeto a las condiciones de seguridad y privacidad de la información del Titular.' },
          { texto: 'Tramitar las consultas y reclamos formulados en los términos señalados en la ley.' },
          { texto: 'Adoptar un Manual interno de políticas y procedimientos para garantizar el adecuado cumplimiento de la ley y, en especial, para la atención de consultas y reclamos.' },
          { texto: 'Informar al Encargado del Tratamiento cuando determinada información se encuentra en discusión por parte del Titular.' },
          { texto: 'Informar a solicitud del Titular sobre el uso dado a sus datos.' },
          { texto: 'Informar a la Superintendencia de Industria y Comercio cuando se presenten violaciones a los códigos de seguridad y existan riesgos en la administración de la información de los Titulares.' },
          { texto: 'Cumplir las instrucciones y requerimientos que imparta la Superintendencia de Industria y Comercio.' },
        ],
      },
      { tipo: 'parrafo', texto: 'Nota: Estos deberes y obligaciones solamente se reconocen y garantizan sobre los datos de carácter personal de las personas naturales que se encuentren almacenados en bases de datos.' },
      { tipo: 'subtitulo', texto: '5.1 Deber de Secreto y confidencialidad' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. se compromete a cumplir con el deber de secreto frente a datos personales privados, sensibles o de menores, el secreto profesional, respecto de los mismos y al deber de guardarlos, obligaciones que subsistirán aún después de finalizar sus relaciones contractuales con DROPI S.A.S.' },
      { tipo: 'parrafo', texto: 'El incumplimiento del deber de secreto será sancionado de conformidad con lo previsto en el Manual interno de trabajo y la legislación vigente.' },
    ],
  },
  {
    id: 'politicas-tratamiento',
    insignia: '6',
    titulo: 'Políticas de Tratamiento de la Información',
    bloques: [
      { tipo: 'subtitulo', texto: '6.1 Generalidades sobre la autorización' },
      { tipo: 'parrafo', texto: 'Cuando se trate de datos diferentes a los de naturaleza pública, DROPI S.A.S. solicitará previamente la autorización para el tratamiento de datos personales por cualquier medio que permita ser utilizado como prueba. Dicha autorización puede ser parte de un documento más amplio como un contrato, o de un documento específico (formato, formulario, otrosí, etc.).' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. informará al titular de los datos lo siguiente:' },
      {
        tipo: 'lista',
        items: [
          { texto: 'El tratamiento al que serán sometidos sus datos personales y la finalidad específica del mismo.' },
          { texto: 'Los derechos que le asisten como titular.' },
          { texto: 'La página web y demás canales de comunicación en los cuales podrá formular consultas y/o reclamos: https://dropi.co/ · administrativo@dropi.co · KR 65 # 9 – 86, Cali – Valle del Cauca.' }
        ],
      },
      { tipo: 'subtitulo', texto: '6.2 Del derecho de acceso' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. garantiza el derecho de acceso conforme a la Ley 1581 de 2012, solamente a los Titulares de datos personales privados que correspondan a personas naturales, previa acreditación de la identidad del titular, legitimidad, o personalidad de su representante, poniendo a disposición de éste, sin costo o erogación alguna, de manera pormenorizada y detallada, los respectivos datos personales tratados.' },
      { tipo: 'subtitulo', texto: '6.3 Del derecho de consulta' },
      { tipo: 'parrafo', texto: 'Los titulares de los datos personales podrán consultar la información de carácter personal que repose en cualquier base de datos de DROPI S.A.S. DROPI S.A.S. establecerá las medidas de autenticación que permitan identificar de manera segura al titular de los datos personales que realiza la consulta o petición.' },
      { tipo: 'subtitulo', texto: '6.4 Del derecho a reclamar' },
      { tipo: 'parrafo', texto: 'El Titular de datos personales privados que correspondan a una persona natural y considere que la información contenida en una base de datos puede ser objeto de corrección, actualización o supresión, o cuando advierta el presunto incumplimiento de cualquiera de los deberes y principios contenidos en la normatividad sobre Protección de Datos Personales, podrá presentar reclamación ante el responsable o Encargado del tratamiento de DROPI S.A.S.' },
      { tipo: 'subtitulo', texto: '6.5 Del derecho a la rectificación y actualización de datos' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. se obliga a rectificar y actualizar a solicitud del Titular la información de carácter personal que resulte incompleta o inexacta. En las solicitudes de rectificación y actualización de datos personales, el Titular debe indicar las correcciones a realizar y aportar la documentación que avale su petición. DROPI S.A.S. tiene plena libertad de habilitar mecanismos que le faciliten el ejercicio de este derecho, siempre y cuando beneficien al Titular de los datos personales.' },
      { tipo: 'subtitulo', texto: '6.6 Del derecho a la supresión de datos' },
      { tipo: 'parrafo', texto: 'El Titular de datos personales tiene el derecho en todo momento a solicitar a DROPI S.A.S. la supresión (eliminación) de sus datos personales, cuando:' },
      {
        tipo: 'lista',
        items: [
          { texto: 'Los mismos no están siendo tratados conforme a los principios, deberes y obligaciones previstas en la normatividad vigente.' },
          { texto: 'Hayan dejado de ser necesarios o pertinentes para la finalidad para la cual fueron recabados.' },
          { texto: 'Se haya superado el periodo necesario para el cumplimiento de los fines para los que fueron recogidos.' }
        ],
      },
      { tipo: 'parrafo', texto: 'El derecho de supresión no es absoluto. DROPI S.A.S. puede negar o limitar el ejercicio del mismo cuando exista deber legal o contractual de permanecer en la base de datos, cuando la eliminación obstaculice actuaciones judiciales o administrativas, cuando los datos sean necesarios para proteger los intereses jurídicamente tutelados del titular, o cuando sean datos de naturaleza pública.' },
      { tipo: 'subtitulo', texto: '6.7 Del derecho a revocar la autorización' },
      { tipo: 'parrafo', texto: 'Todo titular de datos personales que correspondan a personas naturales puede revocar en cualquier momento el consentimiento al tratamiento de éstos, siempre y cuando no lo impida una disposición legal o contractual. DROPI S.A.S. ha establecido mecanismos sencillos y gratuitos que le permiten al titular revocar su consentimiento de forma total o parcial.' },
      { tipo: 'parrafo', texto: 'El derecho de revocatoria no es absoluto y puede ser negado o limitado cuando exista deber legal o contractual de permanecer en la base de datos, cuando obstaculice actuaciones judiciales o administrativas, cuando los datos sean necesarios para proteger intereses jurídicamente tutelados del titular, o cuando sean datos de naturaleza pública.' },
      { tipo: 'subtitulo', texto: '6.8 Protección de datos en los contratos' },
      { tipo: 'parrafo', texto: 'En los contratos, DROPI S.A.S. ha incluido cláusulas para autorizar de manera previa y general el tratamiento de datos personales relacionados con la ejecución del contrato. En los contratos de prestación de servicios externos, cuando el contratista requiera de datos personales, DROPI S.A.S. le suministrará dicha información siempre y cuando exista una autorización previa y expresa del Titular, quedando excluida de esta autorización los datos personales de naturaleza pública.' },
      { tipo: 'parrafo', texto: 'Los terceros que actúen como Encargados del tratamiento de datos tendrán contratos que incluirán cláusulas que precisan los fines y tratamientos autorizados, así como las obligaciones y deberes establecidos en la Ley 1581 de 2012 y el Decreto Reglamentario 1377 de 2013, incluyendo las medidas de seguridad necesarias que garanticen la confidencialidad, integridad y disponibilidad de la información.' },
      { tipo: 'subtitulo', texto: '6.9 Transferencia de datos personales a terceros países' },
      { tipo: 'parrafo', texto: 'En los casos en que DROPI S.A.S. en desarrollo de alguna de sus actividades implique la transferencia de datos de carácter personal a terceros países, se regirá por las siguientes condiciones:' },
      {
        tipo: 'lista',
        items: [
          { texto: 'La transferencia de datos personales a terceros países solamente se realizará cuando exista autorización correspondiente del titular y previa autorización de la Delegatura de Datos Personales de la SIC.' },
          { texto: 'Se considera una transferencia internacional cualquier tratamiento que suponga una transmisión de datos fuera del territorio colombiano.' },
          { texto: 'Se debe obtener la autorización previa del delegado de Protección de Datos Personales de la Superintendencia de Industria y Comercio cuando se tenga previsto realizar transferencias internacionales de datos a países que no proporcionan un cierto nivel de protección.' },
          { texto: 'DROPI S.A.S. no solicitará la autorización cuando la transferencia internacional de datos se encuentre amparada en alguna de las excepciones previstas en la Ley y su Decreto Reglamentario (consentimiento del afectado, necesidad para establecer la relación contractual, transacciones dinerarias, entre otros).' }
        ],
      },
      { tipo: 'subtitulo', texto: '6.10 Reglas generales aplicables' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. ha establecido las siguientes reglas generales para la protección de datos personales, sensibles y de menores:' },
      {
        tipo: 'lista',
        items: [
          { texto: 'DROPI S.A.S. garantiza la autenticidad, confidencialidad e integridad de la información que tenga bajo su responsabilidad.' },
          { texto: 'En los casos en que la infraestructura dependa de un tercero, se cerciorará que tanto la disponibilidad de la información como el cuidado de los datos personales sea un objetivo fundamental.' },
          { texto: 'DROPI S.A.S. realizará auditorías y controles de manera periódica para garantizar la correcta implementación de la Ley 1581 de 2012 y sus decretos reglamentarios.' },
          { texto: 'Es responsabilidad de los funcionarios de DROPI S.A.S. reportar inmediatamente ante la Superintendencia de Industria y Comercio cualquier incidente de fuga de información, daño informático, violación de datos personales, suplantación de identidad u otras conductas que puedan vulnerar la intimidad de una persona o generar cualquier tipo de discriminación.' },
          { texto: 'La formación y capacitación de los funcionarios, proveedores y contratistas será un deber y complemento fundamental de esta política.' },
          { texto: 'La Gerencia Administrativa de la compañía debe identificar e impulsar las autorizaciones de los titulares, avisos de privacidad, campañas de sensibilización, leyendas de reclamo y demás procedimientos para dar cumplimiento a la Ley 1581 de 2012 y el Decreto 1377 de 2013.' }
        ],
      },
    ],
  },
  {
    id: 'procedimiento-derechos',
    insignia: '7',
    titulo: 'Procedimiento para el Ejercicio de los Derechos',
    bloques: [
      { tipo: 'parrafo', texto: 'Cualquier consulta o reclamo frente a derechos inherentes de los titulares sobre datos de carácter personal se debe realizar mediante un escrito dirigido a la Dirección de DROPI S.A.S., adjuntando fotocopia del documento de identidad del Titular interesado o cualquier otro documento equivalente que acredite su identidad y titularidad conforme a Derecho.' },
      { tipo: 'parrafo', texto: 'Los derechos de acceso, actualización, rectificación, supresión y revocación de la autorización de datos personales son personalísimos y podrán ser ejercidos únicamente por el Titular. No obstante, el Titular podrá actuar a través de representante legal o apoderado cuando aquel se encuentre en situación de incapacidad o minoría de edad que le imposibiliten el ejercicio personal de los mismos.' },
      { tipo: 'parrafo', texto: 'Una vez cumplidos y agotados los términos señalados por la Ley 1581 de 2012, el Titular al que se le niegue, total o parcialmente, el ejercicio de los derechos de acceso, actualización, rectificación, supresión y revocación por parte de DROPI S.A.S., podrá poner en conocimiento ante la Autoridad Nacional de Protección de Datos Personales (Superintendencia de Industria y Comercio – Delegatura de Protección de Datos Personales) la negación o inconformidad frente al derecho ejercido.' }
    ],
  },
  {
    id: 'funcion-proteccion',
    insignia: '8',
    titulo: 'Función de Protección de Datos Personales al Interior de DROPI S.A.S.',
    bloques: [
      { tipo: 'subtitulo', texto: '8.1 Los Responsables' },
      { tipo: 'parrafo', texto: 'El responsable del tratamiento de los datos personales es DROPI S.A.S., quien tendrá en su interior un Oficial de Protección de Datos que velará por el debido cumplimiento de la presente política y de las demás normas que regulen el buen uso de los datos personales.' },
      { tipo: 'subtitulo', texto: '8.2 Los Encargados' },
      { tipo: 'parrafo', texto: 'Es encargado cualquier persona natural o jurídica, pública o privada, que realice el tratamiento de datos personales por cuenta de DROPI S.A.S. Esto supone que, para cada tratamiento de datos, se hayan definido sus respectivos encargados, y que éstos actúen por instrucción precisa de DROPI S.A.S.' },
      { tipo: 'subtitulo', texto: '8.2.1 Deberes de los Encargados' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. distingue entre encargado interno (empleados de DROPI S.A.S.) y encargado externo (personas naturales o jurídicas que tratan datos que DROPI S.A.S. les suministra para la realización de una tarea asignada). En ambos casos, y conforme a sus obligaciones, deberán:' },
      {
        tipo: 'lista',
        items: [
          { texto: 'Garantizar al Titular, en todo tiempo, el pleno y efectivo ejercicio del derecho de hábeas data.' },
          { texto: 'Conservar la información bajo las condiciones de seguridad necesarias para impedir su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.' },
          { texto: 'Realizar oportunamente la actualización, rectificación o supresión de los datos en los términos establecidos en la ley.' },
          { texto: 'Actualizar la información reportada por los responsables del Tratamiento dentro de los cinco (5) días hábiles contados a partir de su recibo.' },
          { texto: 'Tramitar las consultas y los reclamos formulados por los Titulares en los términos señalados en la ley.' },
          { texto: 'Adoptar un manual interno de políticas y procedimientos para garantizar el adecuado cumplimiento de la ley y, en especial, para la atención de consultas y reclamos.' },
          { texto: 'Registrar en la base de datos la leyenda "reclamo en trámite" y "información en discusión judicial" cuando corresponda.' },
          { texto: 'Abstenerse de circular información que esté siendo controvertida por el Titular.' },
          { texto: 'Permitir el acceso a la información únicamente a las personas que pueden tener acceso a ella.' },
          { texto: 'Informar a la Superintendencia de Industria y Comercio cuando se presenten violaciones a los códigos de seguridad y existan riesgos en la administración de la información de los Titulares.' }
        ],
      },
    ],
  },
  {
    id: 'registro-nacional',
    insignia: '9',
    titulo: 'El Registro Nacional de Bases de Datos',
    bloques: [{ tipo: 'parrafo', texto: 'De acuerdo con el Art. 25 de la Ley 1581 y sus decretos reglamentarios, DROPI S.A.S. registrará, en caso de cumplir con los requisitos de Ley, sus bases de datos y esta política de Protección de Datos Personales en el Registro Nacional de bases de datos administrado por la Superintendencia de Industria y Comercio de conformidad con el procedimiento que sobre el particular defina el Gobierno Nacional.' }],
  },
  {
    id: 'vigencia',
    insignia: '10',
    titulo: 'Vigencia',
    bloques: [
      { tipo: 'parrafo', texto: 'La presente política rige a partir del 28 de agosto de 2021.' },
      { tipo: 'parrafo', texto: 'DROPI S.A.S. podrá modificar los términos y condiciones de la presente política como parte de su esfuerzo por cumplir con las obligaciones establecidas por la Ley 1581 de 2012, los decretos reglamentarios y demás normas que complementen, modifiquen o deroguen, con el fin de reflejar cualquier cambio en sus operaciones. En los casos que esto ocurra, se publicará en la cartelera informativa de la compañía.' },
    ],
  },
  {
    id: 'contacto',
    insignia: '11',
    titulo: 'Información de Contacto',
    bloques: [
      { tipo: 'parrafo', texto: 'Si tiene alguna pregunta sobre esta política, comuníquese con el área administrativa o envíe su consulta a:' },
      {
        tipo: 'lista',
        items: [
          { texto: 'Correo electrónico: administrativo@dropi.co' },
          { texto: 'Dirección física: KR 65 # 9 – 86, Cali – Valle del Cauca, Colombia' },
          { texto: 'Sitio web: https://dropi.co/' }
        ],
      },
    ],
  },
];
