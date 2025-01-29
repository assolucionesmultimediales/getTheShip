let nave;
let enemigo;
let enemigoX, enemigoY; // variables para la posición del enemigo
let lastChangeTime = 0; // ultimo tiempo en que el enemigo cambió de posición, esto es para que no se actualice a la velocidad del lienzo
let changeInterval = 500; // velocidad en la que aparece el enemigo
let puntos = 0; // contador de puntos
let enemigoWidth, enemigoHeight; // ancho y alto del enemigo (lo necesito porque si no no me toma bien los puntos, asi abarca toda el area)
let tiempoLimite = 30000; // 30 segundos en milisegundos
let tiempoInicio = 0; // cuando arranca el temporizador
let juegoActivo = false; // variable para saber si el juego está en marcha
let cartelVisible = true; // variable para mostrar u ocultar el cartel
let resultadoJuego = ''; // para guardar si el jugador ganó o perdió
let mostrarMensajeFinal = false; // controlamos cuando mostrar el mensaje final

// función para precargar las imágenes
function preload() {
  nave = loadImage('/assets/nave1.png');
  enemigo = loadImage('/assets/nave2.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60); // uso los 60 frames para que sea fluido y no todo tosco

  // cargo el resultado guardado en el localStorage (si no existe, queda vacío)
  resultadoJuego = getItem('resultado') || '';

  // inicializo los puntos desde el local storage (si no existe, comienza en 0)
  puntos = 0;

  // defino el tamaño del enemigo según la imagen original
  enemigoWidth = enemigo.width;
  enemigoHeight = enemigo.height;

  // posicion aleatoria del enemigo
  enemigoX = random(windowWidth - enemigoWidth);
  enemigoY = random(windowHeight - enemigoHeight);
}

function draw() {
  background(0);

  // si el cartel está visible, lo mostramos
  if (cartelVisible) {
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("¡Bienvenido a Get the Ship! Tenes 30 segundos para agarrar la nave 10 veces, suerte", width / 2, height / 3);
    textSize(32);
    text("Clic para empezar", width / 2, height / 2);
    return; // detengo el dibujado del resto del juego mientras se muestra el cartel
  }

  // verifico si pasaron 2 segundos para cambiar la posición del enemigo porque si no, automaticamente el lienzo se actualiza por segundo
  if (millis() - lastChangeTime > changeInterval && juegoActivo) {
    enemigoX = random(windowWidth - enemigoWidth); // doy nueva posicion
    enemigoY = random(windowHeight - enemigoHeight); 
    lastChangeTime = millis(); // actualiza el tiempo del último cambio 
  }

  // dibujo el enemigo en su posición actual
  image(enemigo, enemigoX, enemigoY);

  // dibujo la nave siguiendo el mouse
  image(nave, pmouseX, pmouseY, 120, 190); // los dos ultimos parametros son el tama;o

  // muestro los puntos en pantalla
  fill(255);
  textSize(32);
  textAlign(LEFT)
  text("Puntos: " + puntos, 40, 40);

  // muestro el tiempo restante en pantalla
  textAlign(RIGHT)
  let tiempoRestante = tiempoLimite - (millis() - tiempoInicio);
  text("Tiempo: " + Math.max(0, Math.floor(tiempoRestante / 1000)), width - 150, 40);

  // reviso si se superó el tiempo límite
  if (juegoActivo && millis() - tiempoInicio > tiempoLimite) {
    juegoActivo = false;
    // guardo el resultado en el localStorage (si ganaste o perdiste)
    if (puntos >= 10) {
      resultadoJuego = 'Ganaste';
      storeItem('resultado', resultadoJuego);
    } else {
      resultadoJuego = 'Perdiste';
      storeItem('resultado', resultadoJuego);
    }
    // habilito el cartel de fin de juego
    mostrarMensajeFinal = true;
  }

  // reviso si el jugador ganó antes de que termine el tiempo
  if (puntos >= 10 && juegoActivo) {
    juegoActivo = false;  // Detener el juego si se alcanzan los puntos
    resultadoJuego = 'Ganaste';
    storeItem('resultado', resultadoJuego);
    mostrarMensajeFinal = true;  // Activa el mensaje final
  }

  // mostrar el mensaje de fin de juego si el tiempo se agotó o si el jugador ganó
  if (mostrarMensajeFinal) {
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(resultadoJuego + "!", width / 2, height / 3);

    textSize(32);
    text("¿Quieres jugar de nuevo?", width / 2, height / 2);
    textSize(24);
    text("Haz clic para continuar", width / 2, height / 1.5);
  }
}

// si se hace clic en el enemigo se tiene que sumar un punto y debo considerar el ancho y el alto del enemigo porque si no, no es correcta la puntuacion
function mousePressed() {
  // solo registra el clic si el juego está activo
  if (juegoActivo) {
    if (
      mouseX > enemigoX &&
      mouseX < enemigoX + enemigoWidth && 
      mouseY > enemigoY &&
      mouseY < enemigoY + enemigoHeight 
    ) {
      puntos++; // incremento los puntos
      console.log(puntos);
    }
  }

  // si el juego terminó y el mensaje final está visible, reinicia el juego
  if (mostrarMensajeFinal) {
    // si el jugador hizo clic, reinicia el juego
    puntos = 0; // reinicio los puntos
    resultadoJuego = ''; // borro el resultado anterior
    storeItem('resultado', resultadoJuego); // guardo el resultado en el local storage
    iniciarJuego(); // reinicia el juego
  }
}

// función para iniciar el juego
function iniciarJuego() {
  juegoActivo = true;
  cartelVisible = false; // oculto el cartel cuando se inicia el juego
  mostrarMensajeFinal = false; // oculto el mensaje final
  tiempoInicio = millis(); // registro el inicio del juego
  // posicion aleatoria del enemigo al iniciar
  enemigoX = random(windowWidth - enemigoWidth);
  enemigoY = random(windowHeight - enemigoHeight);
}

// para iniciar el juego al hacer clic en cualquier parte
function mouseClicked() {
  if (!juegoActivo && cartelVisible) {
    iniciarJuego(); // inicia el juego al hacer clic
  }
}
