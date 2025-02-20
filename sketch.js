let nave; // variable para la imagen de la nave
let disparo;
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
let lineXone = 0;
let lineYone = 0;
let sonidoAmbiente;
let laser;
let circulos = []; // Arreglo para almacenar los círculos del rastro

// Clase para los círculos del rastro
class Circulo {
  constructor(x, y, tamano) {
    this.x = x;
    this.y = y;
    this.tamano = tamano;
    this.tiempoVida = 1000; // 1 segundo de vida
    this.color = color(random(100, 255), random(100, 255), random(100, 255)); // Color aleatorio
  }

  actualizar() {
    this.tiempoVida -= deltaTime; // Reduce el tiempo de vida
  }

  dibujar() {
    if (this.tiempoVida > 0) {
      noStroke();
      fill(this.color);
      ellipse(this.x, this.y, this.tamano);
    }
  }

  estaMuerto() {
    return this.tiempoVida <= 0; // Devuelve true si el círculo ya no está vivo
  }
}

// cargamos las imágenes
function preload() {
  nave = loadImage('/assets/nave1.png');
  enemigo = loadImage('/assets/nave2.png');
  punio = loadImage('/assets/golpe.gif');
  sonidoAmbiente = loadSound('/assets/sonidoAmbiente.mp3');
  laser = loadSound('/assets/laser.mp3');
  disparo = loadImage('/assets/laser.png')
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

  cursor('/assets/laser.png',mouseX, mouseY, 10,10);

  // Agrega un nuevo círculo cuando el mouse se mueve y el juego está activo
  if (juegoActivo && (mouseX !== pmouseX || mouseY !== pmouseY)) {
    let tamano = random(5, 20); // Tamaño aleatorio
    circulos.push(new Circulo(mouseX, mouseY, tamano));
  }

  // Actualiza y dibuja los círculos
  for (let i = circulos.length - 1; i >= 0; i--) {
    circulos[i].actualizar();
    circulos[i].dibujar();

    // Elimina los círculos que ya no están vivos
    if (circulos[i].estaMuerto()) {
      circulos.splice(i, 1);
    }
  }

//estrellas
  stroke("white");
  strokeWeight(10);
  point(lineXone, lineYone);
  lineXone = random(0, windowWidth);
  lineYone = random(0, windowHeight);

  // pantalla de bienvenida
  if (cartelVisible) {
    strokeWeight(2);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Bienvenido a tu mision", width / 2, height / 3 + 30);
    text("Hace clic 10 veces en la nave enemiga para poder derrotarla", width / 2, height / 3 + 120);
    textSize(32);
    text("Presiona en cualquier lugar para comenzar", width / 2, height / 2 + 30);

    return; // no sigue ejecutando el código después de mostrar el cartel
  }

  if (juegoActivo) {
    if (!sonidoAmbiente.isPlaying()) {
      sonidoAmbiente.loop(); // Usa loop() para que se repita sin interrupciones
    }
  } else {
    sonidoAmbiente.stop();
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
  strokeWeight(1);
  textSize(32);
  fill("pink");
  rect(width - (width - 30), 27, 180, 50); // fondo para el tiempo
  fill("white");
  textAlign(LEFT);
  text("Golpes: " + puntos, 40, 50);

  // Muestro el tiempo restante
  textAlign(RIGHT);
  if (juegoActivo) {
    let tiempoRestante = tiempoLimite - (millis() - tiempoInicio);
    strokeWeight(1);
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

  // cuando se acaba el tiempo, reviso si gano o perdio
  if (juegoActivo && millis() - tiempoInicio > tiempoLimite) {
    juegoActivo = false;
    resultadoJuego = puntos >= 10 ? 'ganaste' : 'perdiste';
    storeItem('resultado', resultadoJuego); // guardo el resultado en el almacenamiento local
    mostrarMensajeFinal = true;
  }

  // si ya se alcanzaron los 10 puntos antes de que termine el tiempo, el jugador gana
  if (puntos >= 10 && juegoActivo) {
    juegoActivo = false;
    resultadoJuego = 'GANASTE';
    storeItem('resultado', resultadoJuego);
    mostrarMensajeFinal = true;
  }

  // mensaje de finalización del juego
  if (mostrarMensajeFinal) {
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(resultadoJuego + " !", width / 2, height / 3);
    textSize(32);
    text("¿Querés jugar de nuevo?", width / 2, height / 2);
    textSize(24);
    text("clic para continuar", width / 2, height / 1.5);
  }

  // si el enemigo fue golpeado, se muestra la imagen del puño
  if (golpeado) {
      image(punio, enemigoX - 50, enemigoY - 50, 300, 300);
    golpeado = false; // reseteo el golpe para que no quede la imagen del puño visible
    laser.play();
  }
}

// cuando el jugador hace clic en la nave enemiga, suma un punto
function mousePressed() {
  if (
    mouseX > enemigoX &&  // El clic está a la derecha del borde izquierdo del enemigo
    mouseX < enemigoX + enemigoWidth &&  // El clic está a la izquierda del borde derecho del enemigo
    mouseY > enemigoY &&  // El clic está debajo del borde superior del enemigo
    mouseY < enemigoY + enemigoHeight  // El clic está encima del borde inferior del enemigo
  ) {
    puntos++; // Aumenta el contador de puntos porque el jugador hizo clic en el enemigo
    golpeado = true; // Activa la variable "golpeado" para mostrar la imagen del puño en la posición del enemigo
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