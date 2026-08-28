const canvas_flor = document.getElementById("flor");
const gl_flor = canvas_flor.getContext("webgl2");

if (!gl_flor) {
    throw new Error("WebGL 2 não é suportado.");
}


// --------------------------------------------------
// 1. VERTICES
// --------------------------------------------------

let vertices_flor = [];

function setSquareVertices_flor(x,y,width,height){
    return new Float32Array([
        x,y+height,
        x+width,y+height,
        x+width,y,
        x,y,
        x+width,y,
        x,y+height
    ]);
}

function setCircleVertices_flor(x,y,radius){
    let pontos = [x,y];
    let lados = 40;
    for(let i=0;i<=lados;i++){
        let angulo = i * 2 * Math.PI / lados;
        pontos.push(x + radius * Math.cos(angulo));
        pontos.push(y + radius * Math.sin(angulo));
    }
    return new Float32Array(pontos);
}


// --------------------------------------------------
// COLORS
// --------------------------------------------------

let colors_flor = [];

function setSquareColors_flor(color){
    let colorValues = [];
    for(let i=0;i<6;i++)
        colorValues.push(...color);
    return new Float32Array(colorValues);
}

function setCircleColors_flor(color){
    let colorValues = [];
    for(let i=0;i<42;i++)
        colorValues.push(...color);
    return new Float32Array(colorValues);
}


// --------------------------------------------------
// 2. BUFFERS
// --------------------------------------------------

const verticesBuffer_flor = gl_flor.createBuffer();

const colorsBuffer_flor = gl_flor.createBuffer();


// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource_flor = `#version 300 es

in vec2 aPosition;
in vec3 aColors;

out vec3 vColors;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vColors = aColors;
}

`;


// --------------------------------------------------
// 4. FRAGMENT SHADER
// --------------------------------------------------

const fragmentShaderSource_flor = `#version 300 es

precision mediump float;

in vec3 vColors;

out vec4 outColor;

void main() {
    outColor = vec4(vColors, 1.0);
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


const vertexShader_flor = createShader(
    gl_flor,
    gl_flor.VERTEX_SHADER,
    vertexShaderSource_flor
);

const fragmentShader_flor = createShader(
    gl_flor,
    gl_flor.FRAGMENT_SHADER,
    fragmentShaderSource_flor
);


// --------------------------------------------------
// 6. CRIAR PROGRAMA
// --------------------------------------------------

const program_flor = gl_flor.createProgram();

gl_flor.attachShader(program_flor, vertexShader_flor);
gl_flor.attachShader(program_flor, fragmentShader_flor);

gl_flor.linkProgram(program_flor);

if (!gl_flor.getProgramParameter(program_flor, gl_flor.LINK_STATUS)) {

    throw new Error(
        gl_flor.getProgramInfoLog(program_flor)
    );
}


// --------------------------------------------------
// 7. LOCAL DOS ATRIBUTOS
// --------------------------------------------------

const positionLocation_flor =
    gl_flor.getAttribLocation(
        program_flor,
        "aPosition"
    );

const colorsLocation_flor =
    gl_flor.getAttribLocation(
        program_flor,
        "aColors"
    );


// --------------------------------------------------
// 8. LIMPAR TELA
// --------------------------------------------------

gl_flor.clearColor(1.0, 1.0, 1.0, 1.0);

gl_flor.clear(gl_flor.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 9. CONFIGURAR ATRIBUTOS E DESENHAR
// --------------------------------------------------

function desenhaQuadrado_flor(x,y,width,height,color){

    gl_flor.bindBuffer(gl_flor.ARRAY_BUFFER, verticesBuffer_flor);

    vertices_flor = setSquareVertices_flor(x,y,width,height);

    gl_flor.bufferData(
        gl_flor.ARRAY_BUFFER,
        vertices_flor,
        gl_flor.STATIC_DRAW
    );

    gl_flor.enableVertexAttribArray(positionLocation_flor);

    gl_flor.vertexAttribPointer(
        positionLocation_flor,
        2,
        gl_flor.FLOAT,
        false,
        0,
        0
    );

    gl_flor.bindBuffer(gl_flor.ARRAY_BUFFER, colorsBuffer_flor);

    colors_flor = setSquareColors_flor(color);

    gl_flor.bufferData(
        gl_flor.ARRAY_BUFFER,
        colors_flor,
        gl_flor.STATIC_DRAW
    );

    gl_flor.enableVertexAttribArray(colorsLocation_flor);

    gl_flor.vertexAttribPointer(
        colorsLocation_flor,
        3,
        gl_flor.FLOAT,
        false,
        0,
        0
    );

    gl_flor.useProgram(program_flor);

    gl_flor.drawArrays(
        gl_flor.TRIANGLES,
        0,
        vertices_flor.length / 2
    );
}


function desenhaCirculo_flor(x,y,radius,color){

    gl_flor.bindBuffer(gl_flor.ARRAY_BUFFER, verticesBuffer_flor);

    vertices_flor = setCircleVertices_flor(x,y,radius);

    gl_flor.bufferData(
        gl_flor.ARRAY_BUFFER,
        vertices_flor,
        gl_flor.STATIC_DRAW
    );

    gl_flor.enableVertexAttribArray(positionLocation_flor);

    gl_flor.vertexAttribPointer(
        positionLocation_flor,
        2,
        gl_flor.FLOAT,
        false,
        0,
        0
    );

    gl_flor.bindBuffer(gl_flor.ARRAY_BUFFER, colorsBuffer_flor);

    colors_flor = setCircleColors_flor(color);

    gl_flor.bufferData(
        gl_flor.ARRAY_BUFFER,
        colors_flor,
        gl_flor.STATIC_DRAW
    );

    gl_flor.enableVertexAttribArray(colorsLocation_flor);

    gl_flor.vertexAttribPointer(
        colorsLocation_flor,
        3,
        gl_flor.FLOAT,
        false,
        0,
        0
    );

    gl_flor.useProgram(program_flor);

    gl_flor.drawArrays(
        gl_flor.TRIANGLE_FAN,
        0,
        vertices_flor.length / 2
    );
}


// --------------------------------------------------
// 10. DESENHAR
// --------------------------------------------------

// caule
desenhaQuadrado_flor(-0.03,-0.9,0.06,0.75,[0.1,0.6,0.2]);

// petalas
let distancia_flor = 0.28;

for(let i=0;i<6;i++){
    let angulo = i * 2 * Math.PI / 6;
    let px = distancia_flor * Math.cos(angulo);
    let py = 0.25 + distancia_flor * Math.sin(angulo);
    desenhaCirculo_flor(px,py,0.22,[1.0,0.4,0.7]);
}

// miolo
desenhaCirculo_flor(0.0,0.25,0.2,[1.0,0.9,0.0]);