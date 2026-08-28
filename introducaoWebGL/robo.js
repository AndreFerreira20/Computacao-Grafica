const canvas_robo = document.getElementById("robo");
const gl_robo = canvas_robo.getContext("webgl2");

if (!gl_robo) {
    throw new Error("WebGL 2 não é suportado.");
}


// --------------------------------------------------
// 1. VERTICES
// --------------------------------------------------

let vertices_robo = [];

function setSquareVertices_robo(x,y,width,height){
    return new Float32Array([
        x,y+height,
        x+width,y+height,
        x+width,y,
        x,y,
        x+width,y,
        x,y+height
    ]);
}


// --------------------------------------------------
// COLORS
// --------------------------------------------------

let colors_robo = [];

function setSquareColors_robo(color){
    let colorValues = [];
    for(let i=0;i<6;i++)
        colorValues.push(...color);
    return new Float32Array(colorValues);
}


// --------------------------------------------------
// 2. BUFFERS
// --------------------------------------------------

const verticesBuffer_robo = gl_robo.createBuffer();

const colorsBuffer_robo = gl_robo.createBuffer();


// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource_robo = `#version 300 es

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

const fragmentShaderSource_robo = `#version 300 es

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


const vertexShader_robo = createShader(
    gl_robo,
    gl_robo.VERTEX_SHADER,
    vertexShaderSource_robo
);

const fragmentShader_robo = createShader(
    gl_robo,
    gl_robo.FRAGMENT_SHADER,
    fragmentShaderSource_robo
);


// --------------------------------------------------
// 6. CRIAR PROGRAMA
// --------------------------------------------------

const program_robo = gl_robo.createProgram();

gl_robo.attachShader(program_robo, vertexShader_robo);
gl_robo.attachShader(program_robo, fragmentShader_robo);

gl_robo.linkProgram(program_robo);

if (!gl_robo.getProgramParameter(program_robo, gl_robo.LINK_STATUS)) {

    throw new Error(
        gl_robo.getProgramInfoLog(program_robo)
    );
}


// --------------------------------------------------
// 7. LOCAL DOS ATRIBUTOS
// --------------------------------------------------

const positionLocation_robo =
    gl_robo.getAttribLocation(
        program_robo,
        "aPosition"
    );

const colorsLocation_robo =
    gl_robo.getAttribLocation(
        program_robo,
        "aColors"
    );


// --------------------------------------------------
// 8. LIMPAR TELA
// --------------------------------------------------

gl_robo.clearColor(1.0, 1.0, 1.0, 1.0);

gl_robo.clear(gl_robo.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 9. CONFIGURAR ATRIBUTOS E DESENHAR
// --------------------------------------------------

function desenhaQuadrado_robo(x,y,width,height,color){

    gl_robo.bindBuffer(gl_robo.ARRAY_BUFFER, verticesBuffer_robo);

    vertices_robo = setSquareVertices_robo(x,y,width,height);

    gl_robo.bufferData(
        gl_robo.ARRAY_BUFFER,
        vertices_robo,
        gl_robo.STATIC_DRAW
    );

    gl_robo.enableVertexAttribArray(positionLocation_robo);

    gl_robo.vertexAttribPointer(
        positionLocation_robo,
        2,
        gl_robo.FLOAT,
        false,
        0,
        0
    );

    gl_robo.bindBuffer(gl_robo.ARRAY_BUFFER, colorsBuffer_robo);

    colors_robo = setSquareColors_robo(color);

    gl_robo.bufferData(
        gl_robo.ARRAY_BUFFER,
        colors_robo,
        gl_robo.STATIC_DRAW
    );

    gl_robo.enableVertexAttribArray(colorsLocation_robo);

    gl_robo.vertexAttribPointer(
        colorsLocation_robo,
        3,
        gl_robo.FLOAT,
        false,
        0,
        0
    );

    gl_robo.useProgram(program_robo);

    gl_robo.drawArrays(
        gl_robo.TRIANGLES,
        0,
        vertices_robo.length / 2
    );
}


// --------------------------------------------------
// 10. DESENHAR
// --------------------------------------------------

// cabeca
desenhaQuadrado_robo(-0.3,0.35,0.6,0.4,[0.6,0.6,0.65]);

// olhos
desenhaQuadrado_robo(-0.2,0.5,0.12,0.12,[0.1,0.1,0.1]);
desenhaQuadrado_robo(0.08,0.5,0.12,0.12,[0.1,0.1,0.1]);

// bracos
desenhaQuadrado_robo(-0.5,-0.2,0.15,0.45,[0.6,0.6,0.65]);
desenhaQuadrado_robo(0.35,-0.2,0.15,0.45,[0.6,0.6,0.65]);

// corpo
desenhaQuadrado_robo(-0.35,-0.25,0.7,0.6,[0.1,0.1,0.1]);

// pernas
desenhaQuadrado_robo(-0.25,-0.75,0.18,0.5,[0.6,0.6,0.65]);
desenhaQuadrado_robo(0.07,-0.75,0.18,0.5,[0.6,0.6,0.65]);