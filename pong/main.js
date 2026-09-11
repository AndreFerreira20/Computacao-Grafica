const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}



// Placar

const placarEsquerdaElement = document.getElementById("placarEsquerda");
const placarDireitaElement = document.getElementById("placarDireita");

let pontosEsquerda = 0;
let pontosDireita = 0;

// --------------------------------------------------
// VERTICES E CORES
// --------------------------------------------------


function verticesBarra(){
    return new Float32Array([
        -0.03,  0.2,
        -0.03, -0.2,
         0.03,  0.2,
         0.03,  0.2,
        -0.03, -0.2,
         0.03, -0.2
    ]);
}

function verticesBola(){
    let vertices = [];
    let numSegments = 30;
    let radius = 0.05;

    for (let i = 0; i < numSegments; i++) {
        let theta1 = (i / numSegments) * 2 * Math.PI;
        let theta2 = ((i + 1) / numSegments) * 2 * Math.PI;

        vertices.push(0, 0); // Center of the circle
        vertices.push(radius * Math.cos(theta1), radius * Math.sin(theta1));
        vertices.push(radius * Math.cos(theta2), radius * Math.sin(theta2));
    }

    return new Float32Array(vertices);
}

let verticesBarraDireita = verticesBarra();

let corBarraDireita = new Float32Array([
    0.0, 0.0, 1.0,
]);

let verticesBarraEsquerda = verticesBarra();

let corBarraEsquerda = new Float32Array([
    0.0, 1.0, 0.0,
]);

let verticesBolaCentro = verticesBola();

let corBolaCentro = new Float32Array([
    1.0, 0.0, 0.0,
]);

// --------------------------------------------------
// TRANSFORMAÇÕES
// --------------------------------------------------

const barraEsquerdaX = -0.9;
const barraDireitaX = 0.9;
let barraEsquerdaY = 0.0;
let barraDireitaY = 0.0;

let MbarraEsquerda = m3.translation(barraEsquerdaX, barraEsquerdaY);

let MbarraDireita = m3.translation(barraDireitaX, barraDireitaY);

let MbolaCentro = m3.identity();

// --------------------------------------------------
// BUFFER
// --------------------------------------------------

const verticesBuffer = gl.createBuffer();

// --------------------------------------------------
// VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 aPosition;

uniform mat3 u_transform;

out vec3 vColor;

void main() {
    vec3 position = u_transform * vec3(aPosition, 1.0);
    gl_Position = vec4(position.xy, 0.0, 1.0);
}

`;

// --------------------------------------------------
// FRAGMENT SHADER
// --------------------------------------------------

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec3 uColor;

out vec4 outColor;

void main() {
    outColor = vec4(uColor, 1.0);
}

`;

// --------------------------------------------------
// COMPILAR SHADERS
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
// CRIAR PROGRAMA
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
// LOCAL DOS ATRIBUTOS E DO UNIFORM
// --------------------------------------------------

const positionLocation =
    gl.getAttribLocation(
        program,
        "aPosition"
    );

const colorLocation =
    gl.getUniformLocation(
        program,
        "uColor"
    );

const transformLocation =
    gl.getUniformLocation(
        program,
        "u_transform"
    );

// --------------------------------------------------
// TECLADO
// --------------------------------------------------

let teclas = {};

document.addEventListener("keydown", function(event){
    teclas[event.key.toLowerCase()] = true;
    if (event.key === "ArrowUp" || event.key === "ArrowDown")
        event.preventDefault();
}, false);

document.addEventListener("keyup", function(event){
    teclas[event.key.toLowerCase()] = false;
}, false);

// --------------------------------------------------
// LIMPAR TELA
// --------------------------------------------------

gl.clearColor(0.1, 0.1, 0.1, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);

// --------------------------------------------------
// DESENHAR
// --------------------------------------------------

const numComponents = 2;

function drawScene(){

    atualizaBarras();
    atualizaAnimacao();

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    drawBarraEsquerda();
    drawBarraDireita();
    drawBolaCentro();
    
    requestAnimationFrame(drawScene);
}

function drawBarraEsquerda(){

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        verticesBarraEsquerda,
        gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);

    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.uniform3fv(
        colorLocation,
        corBarraEsquerda
    );

    gl.uniformMatrix3fv(
        transformLocation,
        false,
        MbarraEsquerda
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        verticesBarraEsquerda.length / numComponents
    );

}

function drawBarraDireita(){

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        verticesBarraDireita,
        gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);

    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.uniform3fv(
        colorLocation,
        corBarraDireita
    );

    gl.uniformMatrix3fv(
        transformLocation,
        false,
        MbarraDireita
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        verticesBarraDireita.length / numComponents
    );

}

function drawBolaCentro(){

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        verticesBolaCentro,
        gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);

    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.uniform3fv(
        colorLocation,
        corBolaCentro
    );

    gl.uniformMatrix3fv(
        transformLocation,
        false,
        MbolaCentro
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        verticesBolaCentro.length / numComponents
    );

}

// --------------------------------------------------
// PARÂMETROS ANIMAÇÃO
// --------------------------------------------------

let txBola = 0.0;
let tyBola = 0.0;
let txBola_offset = 0.012;
let tyBola_offset = 0.009;
let barraOffset = 0.03;

const limiteYBarra = 1.0 - 0.2;
const limiteYBola = 1.0 - 0.05;

function atualizaBarras(){
    if(teclas["w"])
        barraEsquerdaY += barraOffset;
    if(teclas["s"])
        barraEsquerdaY -= barraOffset;
    if(teclas["arrowup"])
        barraDireitaY += barraOffset;
    if(teclas["arrowdown"])
        barraDireitaY -= barraOffset;

    barraEsquerdaY = Math.max(-limiteYBarra, Math.min(limiteYBarra, barraEsquerdaY));
    barraDireitaY = Math.max(-limiteYBarra, Math.min(limiteYBarra, barraDireitaY));

    MbarraEsquerda = m3.translation(barraEsquerdaX, barraEsquerdaY);
    MbarraDireita = m3.translation(barraDireitaX, barraDireitaY);
}

function colideBarra(barraX, barraY){
    return Math.abs(txBola - barraX) <= 0.03 + 0.05 &&
           Math.abs(tyBola - barraY) <= 0.2 + 0.05;
}

function resetaBola(direcao){
    txBola = 0.0;
    tyBola = 0.0;
    txBola_offset = 0.012 * direcao;
}

function atualizaAnimacao(){
    txBola += txBola_offset;
    tyBola += tyBola_offset;

    if(tyBola > limiteYBola || tyBola < -limiteYBola)
        tyBola_offset = -tyBola_offset;

    if(txBola_offset < 0 && colideBarra(barraEsquerdaX, barraEsquerdaY))
    {
        txBola = barraEsquerdaX + 0.03 + 0.05;
        txBola_offset = -txBola_offset;
    }
    if(txBola_offset > 0 && colideBarra(barraDireitaX, barraDireitaY))
    {
        txBola = barraDireitaX - 0.03 - 0.05;
        txBola_offset = -txBola_offset;
    }

    if(txBola < -1.0)
    {
        pontosDireita++;
        atualizaPlacar();
        resetaBola(1);
    }
    else if(txBola > 1.0)
    {
        pontosEsquerda++;
        atualizaPlacar();
        resetaBola(-1);
    }

    MbolaCentro = m3.translation(txBola, tyBola);
}

function atualizaPlacar(){
    placarEsquerdaElement.textContent = pontosEsquerda;
    placarDireitaElement.textContent = pontosDireita;
}

// --------------------------------------------------
// INÍCIO DO DESENHO
// --------------------------------------------------

drawScene();