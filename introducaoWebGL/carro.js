const canvas_carro = document.getElementById("carro");
const gl_carro = canvas_carro.getContext("webgl2");

if (!gl_carro) {
    throw new Error("WebGL 2 não é suportado.");
}


// --------------------------------------------------
// 1. VERTICES
// --------------------------------------------------

let vertices_carro = [];

function setSquareVertices_carro(x,y,width,height){
    return new Float32Array([
        x,y+height,
        x+width,y+height,
        x+width,y,
        x,y,
        x+width,y,
        x,y+height
    ]);
}

function setCircleVertices_carro(x,y,radius){
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

let colors_carro = [];

function setSquareColors_carro(color){
    let colorValues = [];
    for(let i=0;i<6;i++)
        colorValues.push(...color);
    return new Float32Array(colorValues);
}

function setCircleColors_carro(color){
    let colorValues = [];
    for(let i=0;i<42;i++)
        colorValues.push(...color);
    return new Float32Array(colorValues);
}


// --------------------------------------------------
// 2. BUFFERS
// --------------------------------------------------

const verticesBuffer_carro = gl_carro.createBuffer();

const colorsBuffer_carro = gl_carro.createBuffer();


// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource_carro = `#version 300 es

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

const fragmentShaderSource_carro = `#version 300 es

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


const vertexShader_carro = createShader(
    gl_carro,
    gl_carro.VERTEX_SHADER,
    vertexShaderSource_carro
);

const fragmentShader_carro = createShader(
    gl_carro,
    gl_carro.FRAGMENT_SHADER,
    fragmentShaderSource_carro
);


// --------------------------------------------------
// 6. CRIAR PROGRAMA
// --------------------------------------------------

const program_carro = gl_carro.createProgram();

gl_carro.attachShader(program_carro, vertexShader_carro);
gl_carro.attachShader(program_carro, fragmentShader_carro);

gl_carro.linkProgram(program_carro);

if (!gl_carro.getProgramParameter(program_carro, gl_carro.LINK_STATUS)) {

    throw new Error(
        gl_carro.getProgramInfoLog(program_carro)
    );
}


// --------------------------------------------------
// 7. LOCAL DOS ATRIBUTOS
// --------------------------------------------------

const positionLocation_carro =
    gl_carro.getAttribLocation(
        program_carro,
        "aPosition"
    );

const colorsLocation_carro =
    gl_carro.getAttribLocation(
        program_carro,
        "aColors"
    );


// --------------------------------------------------
// 8. LIMPAR TELA
// --------------------------------------------------

gl_carro.clearColor(1.0, 1.0, 1.0, 1.0);

gl_carro.clear(gl_carro.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 9. CONFIGURAR ATRIBUTOS E DESENHAR
// --------------------------------------------------

function desenhaQuadrado_carro(x,y,width,height,color){

    gl_carro.bindBuffer(gl_carro.ARRAY_BUFFER, verticesBuffer_carro);

    vertices_carro = setSquareVertices_carro(x,y,width,height);

    gl_carro.bufferData(
        gl_carro.ARRAY_BUFFER,
        vertices_carro,
        gl_carro.STATIC_DRAW
    );

    gl_carro.enableVertexAttribArray(positionLocation_carro);

    gl_carro.vertexAttribPointer(
        positionLocation_carro,
        2,
        gl_carro.FLOAT,
        false,
        0,
        0
    );

    gl_carro.bindBuffer(gl_carro.ARRAY_BUFFER, colorsBuffer_carro);

    colors_carro = setSquareColors_carro(color);

    gl_carro.bufferData(
        gl_carro.ARRAY_BUFFER,
        colors_carro,
        gl_carro.STATIC_DRAW
    );

    gl_carro.enableVertexAttribArray(colorsLocation_carro);

    gl_carro.vertexAttribPointer(
        colorsLocation_carro,
        3,
        gl_carro.FLOAT,
        false,
        0,
        0
    );

    gl_carro.useProgram(program_carro);

    gl_carro.drawArrays(
        gl_carro.TRIANGLES,
        0,
        vertices_carro.length / 2
    );
}


function desenhaCirculo_carro(x,y,radius,color){

    gl_carro.bindBuffer(gl_carro.ARRAY_BUFFER, verticesBuffer_carro);

    vertices_carro = setCircleVertices_carro(x,y,radius);

    gl_carro.bufferData(
        gl_carro.ARRAY_BUFFER,
        vertices_carro,
        gl_carro.STATIC_DRAW
    );

    gl_carro.enableVertexAttribArray(positionLocation_carro);

    gl_carro.vertexAttribPointer(
        positionLocation_carro,
        2,
        gl_carro.FLOAT,
        false,
        0,
        0
    );

    gl_carro.bindBuffer(gl_carro.ARRAY_BUFFER, colorsBuffer_carro);

    colors_carro = setCircleColors_carro(color);

    gl_carro.bufferData(
        gl_carro.ARRAY_BUFFER,
        colors_carro,
        gl_carro.STATIC_DRAW
    );

    gl_carro.enableVertexAttribArray(colorsLocation_carro);

    gl_carro.vertexAttribPointer(
        colorsLocation_carro,
        3,
        gl_carro.FLOAT,
        false,
        0,
        0
    );

    gl_carro.useProgram(program_carro);

    gl_carro.drawArrays(
        gl_carro.TRIANGLE_FAN,
        0,
        vertices_carro.length / 2
    );
}


// --------------------------------------------------
// 10. DESENHAR
// --------------------------------------------------

// cabine
desenhaQuadrado_carro(-0.3,0.15,0.6,0.3,[0.5,0.85,0.95]);

// corpo
desenhaQuadrado_carro(-0.6,-0.2,1.2,0.35,[0.9,0.1,0.1]);

// rodas
desenhaCirculo_carro(-0.32,-0.25,0.15,[0.1,0.1,0.1]);
desenhaCirculo_carro(0.32,-0.25,0.15,[0.1,0.1,0.1]);