(function () {
  "use strict";

  var datos = window.INVITACION || {};
  var reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel) { return document.querySelector(sel); };

  /* ---------- Portada: abrir la invitación ---------- */
  var portada = $("#portada");
  var abriendo = false;
  $("#abrir").addEventListener("click", function () {
    if (abriendo) return;
    abriendo = true;
    var abrir = function () {
      portada.classList.add("is-abierta");
      document.body.classList.remove("is-locked");
      lanzarSolcitos();
      setTimeout(function () { portada.remove(); }, 900);
    };
    if (reducirMovimiento) { abrir(); return; }

    // El sol viaja al centro y crece hasta tapar toda la pantalla.
    var sol = $("#portada-sol");
    var r = sol.getBoundingClientRect();
    var dx = window.innerWidth / 2 - (r.left + r.width / 2);
    var dy = window.innerHeight / 2 - (r.top + r.height / 2);
    var radio = r.width * 0.26; // radio del círculo amarillo dentro del dibujo
    var escala = (Math.hypot(window.innerWidth, window.innerHeight) / 2) / radio * 1.15; // el círculo amarillo liso tapa toda la pantalla
    portada.classList.add("is-expandiendo");
    sol.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + escala + ")";
    setTimeout(abrir, 1350);
  });

  /* ---------- Nombres ---------- */
  document.querySelectorAll("[data-papis]").forEach(function (el) {
    if (datos.papis) el.textContent = datos.papis;
  });
  document.querySelectorAll("[data-bebe]").forEach(function (el) {
    if (datos.bebe) el.textContent = datos.bebe;
  });

  /* ---------- Fotos (si no están, solecito) ---------- */
  document.querySelectorAll("img[data-foto]").forEach(function (img) {
    var marco = img.closest(".foto-marco");
    var src = datos.fotos && datos.fotos[img.dataset.foto];
    if (!src) { marco.classList.add("sin-foto"); return; }
    img.addEventListener("error", function () { marco.classList.add("sin-foto"); });
    img.src = src;
  });

  /* ---------- Polaroids de los papis ---------- */
  var polaroids = $("#polaroids");
  var fotosPapis = (datos.fotos && datos.fotos.papis) || [];
  fotosPapis.forEach(function (src) {
    var fig = document.createElement("figure");
    fig.className = "polaroid aparece";
    var img = document.createElement("img");
    img.loading = "lazy";
    img.alt = (datos.papis || "Los papis") + " esperando a " + (datos.bebe || "su bebé");
    img.addEventListener("error", function () { fig.remove(); });
    img.src = src;
    fig.appendChild(img);
    polaroids.appendChild(fig);
  });

  /* ---------- Fecha y lugar ---------- */
  var lugar = datos.lugar || {};
  var fecha = datos.fecha ? new Date(datos.fecha + ":00-03:00") : null;
  if (fecha && isNaN(fecha)) fecha = null;

  if (fecha) {
    var dia = fecha.toLocaleDateString("es-AR", {
      weekday: "long", day: "numeric", month: "long", timeZone: "America/Argentina/Buenos_Aires"
    });
    var hora = fecha.toLocaleTimeString("es-AR", {
      hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Argentina/Buenos_Aires"
    });
    $("#dato-fecha").textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
    $("#dato-hora").textContent = "a las " + hora + " h";
    var agendar = $("#agendar");
    agendar.href = linkCalendario(fecha);
    agendar.target = "_blank";
    agendar.rel = "noopener";
    agendar.hidden = false;
  }

  if (lugar.nombre) $("#dato-lugar").textContent = lugar.nombre;
  if (lugar.direccion) $("#dato-direccion").textContent = lugar.direccion;
  if (lugar.mapsUrl) $("#como-llegar").href = lugar.mapsUrl;
  else $("#como-llegar").hidden = true;

  function linkCalendario(inicio) {
    var fin = new Date(inicio.getTime() + 3 * 60 * 60 * 1000);
    var f = function (d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); };
    var params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Baby shower de " + (datos.bebe || "Emma"),
      dates: f(inicio) + "/" + f(fin),
      location: [lugar.nombre, lugar.direccion].filter(Boolean).join(", ") || lugar.mapsUrl || "",
      details: "¡Te esperamos! " + location.href
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  /* ---------- Cuenta regresiva ---------- */
  if (fecha) {
    var cuenta = $("#cuenta");
    var actualizar = function () {
      var resta = fecha - new Date();
      if (resta <= 0) {
        cuenta.hidden = true;
        $("#cuenta-llego").hidden = false;
        return false;
      }
      cuenta.hidden = false;
      $("#c-dias").textContent = Math.floor(resta / 864e5);
      $("#c-horas").textContent = Math.floor(resta / 36e5) % 24;
      $("#c-min").textContent = Math.floor(resta / 6e4) % 60;
      $("#c-seg").textContent = Math.floor(resta / 1e3) % 60;
      return true;
    };
    if (actualizar()) {
      var timer = setInterval(function () { if (!actualizar()) clearInterval(timer); }, 1000);
    }
  }

  /* ---------- Confirmación por WhatsApp ---------- */
  if (datos.confirmarAntesDe) $("#confirmar-antes").textContent = " " + datos.confirmarAntesDe;
  if (datos.whatsapp) {
    var mensaje = datos.mensajeConfirmar || ("¡Hola! Confirmo mi asistencia al baby shower de " + (datos.bebe || "Emma") + " ☀️");
    var boton = $("#boton-confirmar");
    boton.href = "https://wa.me/" + datos.whatsapp + "?text=" + encodeURIComponent(mensaje);
    boton.hidden = false;
    $("#confirmar-pendiente").hidden = true;
  }

  /* ---------- Lista de regalos ---------- */
  var iconos = {
    panal: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#fff5b0"/><path d="M10 17h28v6c0 9-6 14-14 14s-14-5-14-14z" fill="#fff" stroke="#ee8dbb" stroke-width="2.5" stroke-linejoin="round"/><path d="M10 21h28" stroke="#ee8dbb" stroke-width="2.5"/><circle cx="24" cy="29" r="3" fill="#ffd95a"/></svg>',
    body: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#fff5b0"/><path d="M18 10l-8 6 4 6 4-2v16h12V20l4 2 4-6-8-6c-1 3-3 4-6 4s-5-1-6-4z" fill="#fff" stroke="#ee8dbb" stroke-width="2.5" stroke-linejoin="round"/><path d="M18 36c2 3 10 3 12 0" fill="none" stroke="#ee8dbb" stroke-width="2.5" stroke-linecap="round"/></svg>',
    patito: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#fff5b0"/><path d="M14 27c0-3 3-5 6-5-2-2-2-8 4-8 5 0 6 5 4 8h3c3 0 4 3 3 6-1 5-6 8-11 8s-9-4-9-9z" fill="#ffd95a" stroke="#ee8dbb" stroke-width="2.5" stroke-linejoin="round"/><path d="M28 18l5-1-4 3" fill="#ee8dbb"/><circle cx="25" cy="17" r="1.5" fill="#6e4a5a"/></svg>',
    mamadera: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#fff5b0"/><path d="M21 8h6l1 6h-8z" fill="#ee8dbb"/><rect x="17" y="14" width="14" height="4" rx="2" fill="#fff" stroke="#ee8dbb" stroke-width="2.5"/><path d="M18 18h12v17a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4z" fill="#fff" stroke="#ee8dbb" stroke-width="2.5"/><path d="M22 25h4M22 30h4" stroke="#ee8dbb" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  var contenedor = $("#lista-regalos");
  (datos.regalos || []).forEach(function (grupo) {
    var tarjeta = document.createElement("article");
    tarjeta.className = "regalo aparece";
    var cabeza = document.createElement("div");
    cabeza.className = "regalo-cabeza";
    cabeza.innerHTML = iconos[grupo.icono] || iconos.panal;
    cabeza.firstChild.setAttribute("aria-hidden", "true");
    var titulos = document.createElement("div");
    var h3 = document.createElement("h3");
    h3.textContent = grupo.titulo;
    titulos.appendChild(h3);
    if (grupo.nota) {
      var nota = document.createElement("span");
      nota.className = "nota";
      nota.textContent = grupo.nota;
      titulos.appendChild(nota);
    }
    cabeza.appendChild(titulos);
    var ul = document.createElement("ul");
    grupo.items.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
    tarjeta.appendChild(cabeza);
    tarjeta.appendChild(ul);
    contenedor.appendChild(tarjeta);
  });

  /* ---------- Guirnaldas con estrellitas y solcitos ---------- */
  document.querySelectorAll(".guirnalda").forEach(function (g) {
    var cantidad = 7;
    for (var i = 0; i < cantidad; i++) {
      var c = document.createElement("span");
      var esSol = i % 3 === 1;
      c.className = "colgante" + (esSol ? " es-sol" : "") + (!esSol && i % 2 === 0 ? " es-amarilla" : "");
      var largo = 14 + ((i * 37) % 5) * 9;
      c.style.animationDelay = (-i * 0.45) + "s";
      c.innerHTML = '<i style="height:' + largo + 'px"></i><svg><use href="' + (esSol ? "#sol" : "#estrella") + '"/></svg>';
      g.appendChild(c);
    }
  });

  /* ---------- Doodles sueltos en los márgenes (estilo dibujado a mano) ---------- */
  var trazos = {
    estrella: '<path d="M12 2.8l2.5 5.6 6 .7-4.5 4 1.3 6-5.3-3-5.4 3.1 1.3-6.1L3.4 9.1l6.1-.7z"/>',
    corazon: '<path d="M12 20.5s-7.6-4.6-8.6-9.6C2.7 7.4 5 5 7.6 5.2c1.9.1 3.4 1.6 4.4 3.2 1-1.7 2.6-3.2 4.6-3.2 2.6 0 4.7 2.5 3.9 5.8-1 5-8.5 9.5-8.5 9.5z"/>',
    nube: '<path d="M6.5 17.5h11a3.6 3.6 0 0 0 .3-7.2 5.2 5.2 0 0 0-10-1.1 4.1 4.1 0 0 0-1.3 8.3z"/>',
    espiral: '<path d="M12 12.2c.4-.9 1.8-.6 1.7.5-.2 1.6-2.5 1.9-3.4.6-1.3-1.8.4-4.2 2.6-4 2.8.3 3.9 3.5 2.4 5.7-1.9 2.8-6.3 2.3-7.4-.8"/>',
    puntitos: '<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="8" r="1.4"/><circle cx="18" cy="13" r="1.4"/>'
  };
  var tipos = ["estrella", "corazon", "puntitos", "nube", "estrella", "espiral"];
  document.querySelectorAll(".seccion, .pie").forEach(function (sec, n) {
    var amarilla = sec.classList.contains("amarillo");
    for (var i = 0; i < 6; i++) {
      var tipo = tipos[(i + n) % tipos.length];
      var relleno = amarilla && tipo === "estrella" && i % 2 === 0;
      var d = document.createElement("span");
      d.className = "doodle" + (relleno ? " doodle-relleno" : "") + (tipo === "puntitos" ? " doodle-puntos" : "");
      var izquierda = i % 2 === 0;
      var tam = 14 + ((i * 7 + n * 5) % 13);
      d.style.width = d.style.height = tam + "px";
      d.style[izquierda ? "left" : "right"] = (6 + ((i * 11 + n * 3) % 22)) + "px";
      d.style.top = (12 + i * 15 + ((n * 7) % 6)) + "%";
      d.style.transform = "rotate(" + (((i * 37 + n * 19) % 50) - 25) + "deg)";
      d.innerHTML = '<svg viewBox="0 0 24 24">' + trazos[tipo] + "</svg>";
      sec.appendChild(d);
    }
  });

  /* ---------- Solcitos que flotan ---------- */
  // Van DETRÁS del contenido: cada sección tiene los suyos, debajo de textos, tarjetas y fotos.
  function lanzarSolcitos() {
    if (reducirMovimiento) return;
    document.querySelectorAll(".seccion, .pie").forEach(function (sec, n) {
      for (var i = 0; i < 2; i++) crearSolcito(sec, (n * 1300 + i * 5200) % 9000);
    });
  }
  function crearSolcito(fondo, retraso) {
    var s = document.createElement("span");
    var tam = 18 + Math.random() * 16;
    s.className = "solcito";
    s.style.width = s.style.height = tam + "px";
    s.style.left = Math.random() * 92 + "%";
    s.style.setProperty("--deriva", (Math.random() * 120 - 60) + "px");
    var dur = 14 + Math.random() * 12;
    s.style.animationDuration = dur + "s";
    s.style.animationDelay = retraso / 1000 + "s";
    s.innerHTML = '<svg><use href="#sol"/></svg>';
    fondo.appendChild(s);
    s.addEventListener("animationiteration", function () {
      s.style.left = Math.random() * 92 + "%";
    });
  }

  /* ---------- "Deslizá": se esconde apenas empieza a bajar ---------- */
  var baja = $("#baja");
  window.addEventListener("scroll", function () {
    baja.classList.toggle("is-oculta", window.scrollY > 60);
  }, { passive: true });

  /* ---------- Aparecer al hacer scroll ---------- */
  var aparecen = document.querySelectorAll(".aparece");
  if ("IntersectionObserver" in window && !reducirMovimiento) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    aparecen.forEach(function (el) { obs.observe(el); });
  } else {
    aparecen.forEach(function (el) { el.classList.add("visible"); });
  }
})();
