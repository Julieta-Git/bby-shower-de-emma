/*
  Datos de la invitación. Todo lo que dice "null" está pendiente:
  cuando se completa, la página lo muestra solo.
*/
window.INVITACION = {
  bebe: "Emma Isabella",
  papis: "Rodrigo y Solange",

  // Fecha y hora del baby shower.
  // Formato: "2026-12-20T16:00" (año-mes-día T hora:minutos, hora de Argentina).
  fecha: "2026-12-06T14:00",

  // Lugar (dirección opcional: el link de Maps ya está).
  lugar: {
    nombre: "Quinta La Alfonsina",
    direccion: null,
    mapsUrl: "https://maps.app.goo.gl/JqZJ1VdBRfayikkC6"
  },

  // PENDIENTE: WhatsApp para confirmar asistencia, con código de país y sin "+" ni espacios.
  // Ejemplo: "5493704123456"
  whatsapp: null,

  // PENDIENTE: fecha límite para confirmar (texto libre, ej. "antes del 10 de diciembre").
  confirmarAntesDe: null,

  // Fotos (en assets/fotos/). Si una no está, se muestra un solecito o se oculta.
  fotos: {
    ecografia: "assets/fotos/ecografia.webp",
    papis: [
      "assets/fotos/papis-1.webp",
      "assets/fotos/papis-abrazo.webp",
      "assets/fotos/papis-2.webp"
    ],
    confirmar: "assets/fotos/papis-globos.webp"
  },

  // Lista de regalos (sugerencias que pasó la mamá).
  // Los títulos de cada grupo los propuse yo; se pueden cambiar.
  regalos: [
    {
      titulo: "Cuidado diario",
      icono: "panal",
      items: [
        "Pañales talle M en adelante",
        "Toallitas húmedas",
        "Óleo calcáreo",
        "Talcos",
        "Algodón",
        "Repelente de bebé"
      ]
    },
    {
      titulo: "Ropita",
      icono: "body",
      nota: "Talle +1",
      items: [
        "Ropitas en general (bodies, batitas, ranitas)",
        "Babitas o baberos",
        "Medias y zapatitos"
      ]
    },
    {
      titulo: "Hora del baño",
      icono: "patito",
      items: [
        "Bañera",
        "Toalla",
        "Kit de baño (jabón neutro, shampoo, crema para su cuerpo)",
        "Cepillo o peine para bebé",
        "Perfumitos sin alcohol"
      ]
    },
    {
      titulo: "Para mamá y bebé",
      icono: "mamadera",
      items: [
        "Almohadón de lactancia",
        "Extractor de leche",
        "Mamaderas o chupete RN",
        "Bolso o pañalera"
      ]
    }
  ]
};
