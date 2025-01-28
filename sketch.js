let nave;
let enemigo;
let enemigoX, enemigoY; // variables para la posición del enemigo
let lastChangeTime = 0; // ultimo tiempo en que el enemigo cambió de posición, esto es para que no se actualice a la velocidad del lienzo
let changeInterval = 500; // velocidad en la que aparece el enemigo
let puntos = 0; // contador de puntos
let enemigoWidth, enemigoHeight; // ancho y alto del enemigo (lo necesito porque si no no me toma bien los puntos, asi abarca toda el area)

function preload() {
  nave = loadImage('/assets/nave1.png');
  enemigo = loadImage('/assets/nave2.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60); // uso los 60 frames para que sea fluido y no todo tosco

  // inicializo los puntos desde el local storage (si no existe, comienza en 0)
  puntos = getItem('score') || 0;

  // defino el tamaño del enemigo según la imagen original
  enemigoWidth = enemigo.width;
  enemigoHeight = enemigo.height;

  // posicion aleatoria del enemigo
  enemigoX = random(windowWidth - enemigoWidth);
  enemigoY = random(windowHeight - enemigoHeight);
}

function draw() {
  background(0);

  // verifico si pasaron 2 segundos para cambiar la posición del enemigo porque si no, automaticamente el linzo se actualiza por segundo
  if (millis() - lastChangeTime > changeInterval) {
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
  text("Puntos: " + puntos, 20, 40);
}

// si se hace clic en el enemigo se tiene que sumar un punto y debo considerar el ancho y el alto del enemigo porque si no, no es correcta la puntuacion
function mousePressed() {
  if (
    mouseX > enemigoX &&
    mouseX < enemigoX + enemigoWidth && 
    mouseY > enemigoY &&
    mouseY < enemigoY + enemigoHeight 
  ) {
    puntos++; // incremento los puntos
    storeItem('score', puntos); // guardo los puntos en el local storage
    console.log(puntos);
  }
}
