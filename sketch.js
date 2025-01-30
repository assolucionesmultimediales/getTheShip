let nave; // variable para la imagen de la nave
let enemigo; // variable para la imagen del enemigo
let punio; // variable para la imagen del golpe
let enemigoX, enemigoY; // posición del enemigo
let lastChangeTime = 0; // último tiempo en que el enemigo cambió de posición
let changeInterval = 500; // intervalo de tiempo para que el enemigo cambie de lugar
let puntos = 0; // contador de puntos
let enemigoWidth, enemigoHeight; // tamaño del enemigo
let tiempoLimite = 30000; // 30 segundos en milisegundos
let tiempoInicio = 0; // cuando arranca el temporizador
let juegoActivo = false; // estado del juego
let cartelVisible = true; // variable para mostrar u ocultar el cartel
let resultadoJuego = ''; // para saber si ganaste o perdiste
let mostrarMensajeFinal = false; // control para mostrar el mensaje final
let golpeado = false; // variable para verificar si el enemigo fue golpeado
//variables para las estrellas
let lineXone = 0;
let lineYone = 0;

// cargamos las imágenes
function preload() {
  nave = loadImage('/assets/nave1.png');
  enemigo = loadImage('/assets/nave2.png');
  punio = loadImage('/assets/golpe.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  resultadoJuego = getItem('resultado') || ''; // recupero el resultado del juego anterior

  enemigoWidth = enemigo.width;
  enemigoHeight = enemigo.height;

  // posición inicial del enemigo
  enemigoX = random(windowWidth - enemigoWidth);
  enemigoY = random(windowHeight - enemigoHeight);
}

function draw() {
  background(0);

  // pantalla de bienvenida
  if (cartelVisible) {
    stroke("white");
    strokeWeight(10);
    point(lineXone, lineYone);
    lineXone = random(0, windowWidth);
    lineYone = random(0, windowHeight);

    strokeWeight(2);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Bienvenido a get the ship", width / 2, height / 3 + 30);
    text("tenes 30 segundos para agarrar la nave 10 veces", width / 2, height / 3 + 120);
    textSize(32);
    text("clic para empezar", width / 2, height / 2 + 30);

    return; // no sigue ejecutando el código después de mostrar el cartel
  }

  // actualiza la posición del enemigo cada cierto tiempo
  if (millis() - lastChangeTime > changeInterval && juegoActivo) {
    enemigoX = random(windowWidth - enemigoWidth);
    enemigoY = random(windowHeight - enemigoHeight);
    lastChangeTime = millis();
  }

  // dibujo las imágenes del enemigo y la nave
  image(enemigo, enemigoX, enemigoY);
  image(nave, pmouseX, pmouseY, 120, 190);

  // muestro la cantidad de puntos
  fill(255);
  textSize(32);
  textAlign(LEFT);
  text("Puntos: " + puntos, 40, 40);

  // Muestro el tiempo restante
  textAlign(RIGHT);
  if (juegoActivo) {
    let tiempoRestante = tiempoLimite - (millis() - tiempoInicio);
    fill("pink");
    rect(width - 325, 30, 200, 50); // fondo para el tiempo
    fill("white");
    textSize(32);
    text("Tiempo: " + Math.max(0, Math.floor(tiempoRestante / 1000)), width - 150, 55);
  } else {
    fill("pink");
    rect(width - 325, 30, 200, 50);
    fill("white");
    textSize(32);
    text("Tiempo: 0", width - 150, 55);
  }

  // cuando se acaba el tiempo, revisamos si ganó o perdió
  if (juegoActivo && millis() - tiempoInicio > tiempoLimite) {
    juegoActivo = false;
    resultadoJuego = puntos >= 10 ? 'ganaste' : 'perdiste';
    storeItem('resultado', resultadoJuego); // guardo el resultado en el almacenamiento local
    mostrarMensajeFinal = true;
  }

  // si ya se alcanzaron los 10 puntos antes de que termine el tiempo, el jugador gana
  if (puntos >= 10 && juegoActivo) {
    juegoActivo = false;
    resultadoJuego = 'ganaste';
    storeItem('resultado', resultadoJuego);
    mostrarMensajeFinal = true;
  }

  // mensaje de finalización del juego
  if (mostrarMensajeFinal) {
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(resultadoJuego + "!", width / 2, height / 3);
    textSize(32);
    text("¿Querés jugar de nuevo?", width / 2, height / 2);
    textSize(24);
    text("Haz clic para continuar", width / 2, height / 1.5);
  }

  // si el enemigo fue golpeado, se muestra la imagen del puño
  if (golpeado) {
    image(punio, enemigoX, enemigoY, 200, 200);
    golpeado = false; // reseteo el golpe para que no quede la imagen fija
  }
}

// cuando el jugador hace clic en la nave enemiga, suma un punto
function mousePressed() {
  if (juegoActivo) {
    if (
      mouseX > enemigoX &&
      mouseX < enemigoX + enemigoWidth && 
      mouseY > enemigoY &&
      mouseY < enemigoY + enemigoHeight 
    ) {
      puntos++;
      golpeado = true; // activo el golpe para que se muestre la imagen del puño
    }
  }

  // si el juego terminó, al hacer clic se reinicia
  if (mostrarMensajeFinal) {
    puntos = 0;
    resultadoJuego = '';
    storeItem('resultado', resultadoJuego); // limpio el resultado guardado
    iniciarJuego();
  }
}

// función para iniciar el juego
function iniciarJuego() {
  juegoActivo = true;
  cartelVisible = false;
  mostrarMensajeFinal = false;
  tiempoInicio = millis();
  enemigoX = random(windowWidth - enemigoWidth);
  enemigoY = random(windowHeight - enemigoHeight);
}

// cuando el jugador hace clic en la pantalla inicial, empieza el juego
function mouseClicked() {
  if (!juegoActivo && cartelVisible) {
    iniciarJuego();
  }
}
