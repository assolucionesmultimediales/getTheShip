let nave;
let enemigo;
let punio;
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

// cargamos las imágenes
function preload() {
  nave = loadImage('/assets/nave1.png');
  enemigo = loadImage('/assets/nave2.png');
  punio = loadImage('/assets/golpe.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30); // para que no sea todo tosco y sea fluido

  // cargo el resultado guardado en el localStorage
  resultadoJuego = getItem('resultado') || '';

  // defino el tamaño del enemigo para poder calcular bien los puntos
  enemigoWidth = enemigo.width;
  enemigoHeight = enemigo.height;

  // posicion aleatoria del enemigo
  enemigoX = random(windowWidth - enemigoWidth);
  enemigoY = random(windowHeight - enemigoHeight);
}

function draw() {
  background(0);

  // si el cartel está visible, lo muestro
  if (cartelVisible) {
    //el texto del fondo
    fill(255); // texto blanco
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Bienvenido a get the ship", width / 2, height / 3 + 30);
    text("tenes 30 segundos para agarrar la nave 10 veces", width / 2, height / 3 + 120);
    textSize(32);
    text("clic para empezar", width / 2, height / 2 + 30);

    return; // no dibujamos nada más hasta que el jugador empiece
  }

  // cada vez que pase el intervalo de tiempo, movemos al enemigo a una nueva posición
  if (millis() - lastChangeTime > changeInterval && juegoActivo) {
    enemigoX = random(windowWidth - enemigoWidth);
    enemigoY = random(windowHeight - enemigoHeight);
    lastChangeTime = millis(); // actualizo el tiempo, esto es por que la funcion de manera automatica se reinicia 60 veces en un segundo
  }

  // dibujo el enemigo
  image(enemigo, enemigoX, enemigoY);

  // dibujo la nave donde está el mouse
  image(nave, pmouseX, pmouseY, 120, 190); // le damos tamaño a la nave

  // muestro los puntos
  fill(255);
  textSize(32);
  textAlign(LEFT);
  text("puntos: " + puntos, 40, 40);

  // muestro el tiempo restante
  textAlign(RIGHT);
  if (juegoActivo) { // solo se calcula el tiempo si el juego está activo
    let tiempoRestante = tiempoLimite - (millis() - tiempoInicio);
    text("tiempo: " + Math.max(0, Math.floor(tiempoRestante / 1000)), width - 150, 40);
  } else {
    text("tiempo: 0", width - 150, 40); // cuando el juego no está activo, el tiempo se muestra como 0
  }

  // si el tiempo se agotó, termino el juego
  if (juegoActivo && millis() - tiempoInicio > tiempoLimite) {
    juegoActivo = false;
    if (puntos >= 10) {
      resultadoJuego = 'ganaste';
      storeItem('resultado', resultadoJuego);
    } else {
      resultadoJuego = 'perdiste';
      storeItem('resultado', resultadoJuego);
    }
    mostrarMensajeFinal = true;
  }

  // si el jugador ganó antes de que termine el tiempo
  if (puntos >= 10 && juegoActivo) {
    juegoActivo = false;
    resultadoJuego = 'ganaste';
    storeItem('resultado', resultadoJuego);
    mostrarMensajeFinal = true;
    // seteo el tiempo restante a 0 cuando el jugador gana antes de que se termine el tiempo
    let tiempoRestante = 0;
  }

  // mostrar el mensaje de fin de juego si ya se terminó
  if (mostrarMensajeFinal) {
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(resultadoJuego + "!", width / 2, height / 3);

    textSize(32);
    text("¿queres jugar de nuevo?", width / 2, height / 2);
    textSize(24);
    text("haz clic para continuar", width / 2, height / 1.5);
  }

  // si el enemigo fue golpeado, mostrar la imagen de golpe
  if (golpeado) {
    image(punio, enemigoX, enemigoY,200,200); // muestra la imagen del golpe en lugar del enemigo
    golpeado = false; // resetear el golpe para la siguiente vez
  }
}

// si se hace clic sobre el enemigo, se suman puntos
function mousePressed() {
  if (juegoActivo) {
    if (
      mouseX > enemigoX &&
      mouseX < enemigoX + enemigoWidth && 
      mouseY > enemigoY &&
      mouseY < enemigoY + enemigoHeight 
    ) {
      puntos++; // sumo puntos
      golpeado = true; // marcar que el enemigo fue golpeado
    }
  }

  // si terminó el juego y el mensaje está visible, reinicio el juego
  if (mostrarMensajeFinal) {
    puntos = 0;
    resultadoJuego = '';
    storeItem('resultado', resultadoJuego);
    iniciarJuego();
  }
}

// función para reiniciar el juego
function iniciarJuego() {
  juegoActivo = true;
  cartelVisible = false;
  mostrarMensajeFinal = false;
  tiempoInicio = millis();
  enemigoX = random(windowWidth - enemigoWidth);
  enemigoY = random(windowHeight - enemigoHeight);
}

// para empezar el juego cuando se haga clic
function mouseClicked() {
  if (!juegoActivo && cartelVisible) {
    iniciarJuego();
  }
}
