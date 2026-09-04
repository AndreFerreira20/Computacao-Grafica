const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


// --------------------------------------------------
// 1a. VERTICES
// --------------------------------------------------

let vertices = new Float32Array([0.0,0.0 , 0.0,0.0]);
let pontos = [];
let pontosPixel = [];


// --------------------------------------------------
// 1b. CORES
// --------------------------------------------------

let corAtual = [0.0, 0.0, 1.0];

let colors = new Float32Array([
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0
]);

// --------------------------------------------------
// 1c. TAMANHO DOS PONTOS
// --------------------------------------------------

const pointSize_fixo = 4.0;

let pointSizes = new Float32Array([4.0, 4.0]);

// --------------------------------------------------
// 1d. MODO DE DESENHO
// --------------------------------------------------

let modo = "reta"; // pode ser "reta" ou "triangulo"

// --------------------------------------------------
// 2. BUFFERS
// --------------------------------------------------

const verticesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    vertices,
    gl.STATIC_DRAW
);

const colorsBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    colors,
    gl.STATIC_DRAW
);

const pointSizesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    pointSizes,
    gl.STATIC_DRAW
);

// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 aPosition;
in vec3 aColor;
in float aPointSize;

out vec3 vColor;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    gl_PointSize = aPointSize;
    vColor = aColor;
}

`;


// --------------------------------------------------
// 4. FRAGMENT SHADER
// --------------------------------------------------

const fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 vColor;

out vec4 outColor;

void main() {
    outColor = vec4(vColor, 1.0);
}

`;


// --------------------------------------------------
// 5. COMPILAR SHADERS
// --------------------------------------------------

function createShader(gl, type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        const error = gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}


const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
);

const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);


// --------------------------------------------------
// 6. CRIAR PROGRAMA
// --------------------------------------------------

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

    throw new Error(
        gl.getProgramInfoLog(program)
    );
}


// --------------------------------------------------
// 7. LOCAL DOS ATRIBUTOS
// --------------------------------------------------

const positionLocation =
    gl.getAttribLocation(
        program,
        "aPosition"
    );

const colorLocation =
    gl.getAttribLocation(
        program,
        "aColor"
    );

const pointSizeLocation =
    gl.getAttribLocation(
        program,
        "aPointSize"
    );

// --------------------------------------------------
// 8. CONFIGURAR ATRIBUTOS
// --------------------------------------------------

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.enableVertexAttribArray(colorLocation);

gl.vertexAttribPointer(
    colorLocation,
    3,
    gl.FLOAT,
    false,
    0,
    0
);

gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);

gl.enableVertexAttribArray(pointSizeLocation);

gl.vertexAttribPointer(
    pointSizeLocation,
    1,
    gl.FLOAT,
    false,
    0,
    0
);

// --------------------------------------------------
// ALGORITMO DE BRESENHAM
// --------------------------------------------------

function bresenham(x0, y0, x1, y1) {

    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    let pontosLinha = [];

    let dx = Math.abs(x1 - x0);
    let dy = -Math.abs(y1 - y0);
    
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;

    let erro = dx + dy;

    while (true) {

        pontosLinha.push(x0, y0);

        if (x0 === x1 && y0 === y1) break;

        let e2 = 2 * erro;

        if (e2 >= dy) {
            erro += dy;
            x0 += sx;
        }

        if (e2 <= dx) {
            erro += dx;
            y0 += sy;
        }
    }

    return pontosLinha;
}


// --------------------------------------------------
// ATUALIZAR BUFFERS DE COR E TAMANHO
// --------------------------------------------------

function atualizarCoresETamanhos() {

    const numVertices = vertices.length / 2;

    let coresRepetidas = [];
    let tamanhosRepetidos = [];

    for (let i = 0; i < numVertices; i++) {
        coresRepetidas.push(corAtual[0], corAtual[1], corAtual[2]);
        tamanhosRepetidos.push(pointSize_fixo);
    }

    colors = new Float32Array(coresRepetidas);
    pointSizes = new Float32Array(tamanhosRepetidos);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointSizes, gl.STATIC_DRAW);
}


// --------------------------------------------------
// 9. INTERAÇÃO COM O MOUSE
// --------------------------------------------------

canvas.addEventListener("mousedown",mouseClick,false);

function mouseClick(event){

    // Posição do clique em pixels
    const x = event.offsetX;
    const y = event.offsetY;

    pontosPixel.push(x, y);

    // reta precisa de 2 cliques, triangulo precisa de 3
    const cliquesNecessarios = (modo === "triangulo") ? 3 : 2;

    if (pontosPixel.length / 2 < cliquesNecessarios) {
        return;
    }

    // Gera os pixels da figura usando Bresenham
    let pontosBresenham = [];

    if (modo === "reta") {

        pontosBresenham = bresenham(
            pontosPixel[0], pontosPixel[1],
            pontosPixel[2], pontosPixel[3]
        );

    } else {

        // liga os 3 pontos, dois a dois, fechando o triangulo
        const lado1 = bresenham(
            pontosPixel[0], pontosPixel[1],
            pontosPixel[2], pontosPixel[3]
        );

        const lado2 = bresenham(
            pontosPixel[2], pontosPixel[3],
            pontosPixel[4], pontosPixel[5]
        );

        const lado3 = bresenham(
            pontosPixel[4], pontosPixel[5],
            pontosPixel[0], pontosPixel[1]
        );

        pontosBresenham = lado1.concat(lado2, lado3);
    }

    // Converte cada pixel da figura para o intervalo [-1, 1]
    pontos = [];

    for (let i = 0; i < pontosBresenham.length; i += 2) {

        const px = pontosBresenham[i];
        const py = pontosBresenham[i + 1];

        const webglX = (px / canvas.width) * 2 - 1;
        const webglY = -((py / canvas.height) * 2 - 1);

        pontos.push(webglX, webglY);
    }

    // Substitui os vertices antigos pelos da nova figura
    vertices = new Float32Array(pontos);

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        verticesBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        vertices,
        gl.STATIC_DRAW
    );

    // Cor precisa de um valor para cada pixel da figura
    atualizarCoresETamanhos();

    // Zera os cliques para a proxima figura
    pontosPixel = [];

    // Redesenhar a cena
    drawScene();
}

// --------------------------------------------------
// 10. INTERAÇÃO COM O TECLADO
// --------------------------------------------------

document.addEventListener(
  "keydown",
  keyboardClick,
  false
);

function keyboardClick(event) {

  switch(event.key) {
      case "r":
      case "R":
          modo = "reta";
          pontosPixel = [];
          return;

      case "t":
      case "T":
          modo = "triangulo";
          pontosPixel = [];
          return;

      case "0":
          corAtual = [1.0, 1.0, 1.0];
          break;

      case "1":
          corAtual = [1.0, 0.0, 0.0];
          break;

      case "2":
          corAtual = [0.0, 1.0, 0.0];
          break;

      case "3":
          corAtual = [0.0, 0.0, 1.0];
          break;

      case "4":
          corAtual = [1.0, 1.0, 0.0];
          break;

      case "5":
          corAtual = [1.0, 0.0, 1.0];
          break;

      case "6":
          corAtual = [0.0, 1.0, 1.0];
          break;

      case "7":
          corAtual = [1.0, 0.5, 0.0];
          break;

      case "8":
          corAtual = [0.5, 0.0, 1.0];
          break;

      case "9":
          corAtual = [1.0, 0.4, 0.7];
          break;

      default:
          return;
  }

  // Atualiza o buffer de cor com o valor novo
  atualizarCoresETamanhos();

  // Redesenhar
  drawScene();
}

// --------------------------------------------------
// 11. LIMPAR TELA
// --------------------------------------------------

gl.clearColor(0.1, 0.1, 0.1, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 12. DESENHAR
// --------------------------------------------------

const numComponents = 2;

gl.useProgram(program);

function drawScene(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.drawArrays(
        gl.POINTS,
        0,
        vertices.length / numComponents
    );
}

drawScene();