function addBox(vertices, x1, x2, y1, y2, z1, z2) {

    vertices.push(
        // Front
        x1,y1,z2,  x2,y1,z2,  x2,y2,z2,  x1,y2,z2,

        // Back
        x1,y1,z1,  x1,y2,z1,  x2,y2,z1,  x2,y1,z1,

        // Top
        x1,y2,z1,  x1,y2,z2,  x2,y2,z2,  x2,y2,z1,

        // Bottom
        x1,y1,z1,  x2,y1,z1,  x2,y1,z2,  x1,y1,z2,

        // Right
        x2,y1,z1,  x2,y2,z1,  x2,y2,z2,  x2,y1,z2,

        // Left
        x1,y1,z1,  x1,y1,z2,  x1,y2,z2,  x1,y2,z1
    );
}

function cubeVertices() {

    let vertices = [];

    // Corpo
    addBox( vertices,
        -0.35, 0.35,
        -0.20, 0.20,
        -0.22, 0.22
    );

    // Cauda
    addBox( vertices,
        -0.90, -0.30,
        -0.08, 0.08,
        -0.08, 0.08
    );

    // Helice principal
    addBox( vertices,
        -0.55, 0.55,
        0.23, 0.28,
        -0.05, 0.05
    );

    addBox( vertices,
        -0.05, 0.05,
        0.23, 0.28,
        -0.55, 0.55
    );

    // Helice traseira
    addBox( vertices,
        -1.12, -0.68,
        -0.03, 0.03,
        0.10, 0.16
    );

    addBox( vertices,
        -0.92, -0.88,
        -0.22, 0.22,
        0.10, 0.16
    );

    return new Float32Array(vertices);
}


function heliceMaiorVertices() 
{
    let vertices = [];

    // Helice principal
    addBox( vertices,
        -0.55, 0.55,
        0.23, 0.28,
        -0.05, 0.05
    );

    addBox( vertices,
        -0.05, 0.05,
        0.23, 0.28,
        -0.55, 0.55
    );

    return new Float32Array(vertices);
}

function heliceMenorVertices() 
{
    let vertices = [];

    // Helice traseira
    addBox( vertices,
        -1.12, -0.68,
        -0.03, 0.03,
        0.10, 0.16
    );

    addBox( vertices,
        -0.92, -0.88,
        -0.22, 0.22,
        0.10, 0.16
    );

    return new Float32Array(vertices);
}


//===========================================//
// Cores
//===========================================//

function cubeColors() {

    let colors = [];

    // coloquei essa cor sem querer e achei muito doida
    // por algum motivo mais doido ainda ele roda com o loop i<29
    for (let i = 0; i < 29; i++) {
        colors.push(
            0.1, 0,3, 0,5
        );
    }

    return new Float32Array(colors);
}

function heliceMaiorColors() {

    let colors = [];

    for (let i = 0; i < 48; i++) {
        colors.push(
            0.9, 0.8, 0.4
        );
    }

    return new Float32Array(colors);
}

function heliceMenorColors() {

    let colors = [];

    for (let i = 0; i < 48; i++) {
        colors.push(
            0.8, 0.2, 0.1
        );
    }

    return new Float32Array(colors);
}


//===========================================//


function cubeIndices() {

    let indices = [];

    for (let i = 0; i < 48; i += 24) {

        indices.push(
             i,   i+1, i+2,
             i,   i+2, i+3,

             i+4, i+5, i+6,
             i+4, i+6, i+7,

             i+8, i+9, i+10,
             i+8, i+10, i+11,

             i+12, i+13, i+14,
             i+12, i+14, i+15,

             i+16, i+17, i+18,
             i+16, i+18, i+19,

             i+20, i+21, i+22,
             i+20, i+22, i+23
        );
    }

    return new Uint16Array(indices);
}


const helicopteroGeometry = {

    vertices: cubeVertices(),
    colors: cubeColors(),
    indices: cubeIndices()

};

const heliceMaiorGeometry = {
    vertices: heliceMaiorVertices(),
    colors: heliceMaiorColors(),
    indices: cubeIndices()
};

const heliceMenorGeometry = {
    vertices: heliceMenorVertices(),
    colors: heliceMenorColors(),
    indices: cubeIndices()
};