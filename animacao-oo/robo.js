const canvas_robo = document.getElementById("robo");
const gl_robo = canvas_robo.getContext("webgl2");

if (!gl_robo) {
    throw new Error("WebGL 2 não é suportado.");
}

const vertexShaderSource_robo = `#version 300 es

in vec2 aPosition;

uniform mat3 u_viewTransform;
uniform mat3 u_modelTransform;

void main() {

    vec3 position =
        u_viewTransform *
        u_modelTransform *
        vec3(aPosition, 1.0) ;

    gl_Position =
        vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShaderSource_robo = `#version 300 es

precision mediump float;

uniform vec3 uColor;

out vec4 outColor;

void main() {

    outColor =
        vec4(uColor, 1.0);
}
`;

function createShader(gl, type, source) {

    const shader =
        gl.createShader(type);

    gl.shaderSource(
        shader,
        source
    );

    gl.compileShader(shader);

    if (
        !gl.getShaderParameter(
            shader,
            gl.COMPILE_STATUS
        )
    ) {

        const error =
            gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}

function createProgram(
    gl,
    vertexShaderSource,
    fragmentShaderSource
) {

    const vertexShader =
        createShader(
            gl,
            gl.VERTEX_SHADER,
            vertexShaderSource
        );

    const fragmentShader =
        createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentShaderSource
        );

    const program =
        gl.createProgram();

    gl.attachShader(
        program,
        vertexShader
    );

    gl.attachShader(
        program,
        fragmentShader
    );

    gl.linkProgram(program);

    if (
        !gl.getProgramParameter(
            program,
            gl.LINK_STATUS
        )
    ) {

        throw new Error(
            gl.getProgramInfoLog(program)
        );
    }

    return program;
}

const program_robo =
    createProgram(
        gl_robo,
        vertexShaderSource_robo,
        fragmentShaderSource_robo
    );


// ==================================================
// CLASSE RENDERER
// ==================================================

class RendererRobo {

    constructor(gl, program) {
        this.gl = gl;
        this.program = program;

        this.positionLocation =
            gl.getAttribLocation(
                program,
                "aPosition"
            );

        this.colorLocation =
            gl.getUniformLocation(
                program,
                "uColor"
            );

        this.viewTransformLocation =
            gl.getUniformLocation(
                program,
                "u_viewTransform"
            );

        this.modelTransformLocation =
            gl.getUniformLocation(
                program,
                "u_modelTransform"
            );

        this.viewTransform =
            m3.identity();

        this.verticesBuffer =
            gl.createBuffer();
    }

    defineViewTransform(viewTransform) {
        this.viewTransform =
            viewTransform;
    }

    draw(object) {
        const gl = this.gl;

        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            this.verticesBuffer
        );

        gl.bufferData(
            gl.ARRAY_BUFFER,
            object.vertices,
            gl.STATIC_DRAW
        );

        gl.enableVertexAttribArray(
            this.positionLocation
        );

        gl.vertexAttribPointer(
            this.positionLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        gl.uniform3fv(
            this.colorLocation,
            object.color
        );

        gl.uniformMatrix3fv(
            this.modelTransformLocation,
            false,
            object.modelTransform
        );

        gl.uniformMatrix3fv(
            this.viewTransformLocation,
            false,
            this.viewTransform
        );

        gl.drawArrays(
            gl.TRIANGLES,
            0,
            object.vertices.length / 2
        );
    }
}

// ==================================================
// AUXILIARY FUNCTIONS
// ==================================================

function rectangleVertices_robo(x,y,width,height){

    return new Float32Array([
        x, y,
        x+width, y+height,
        x, y+height,

        x, y,
        x+width, y,
        x+width, y+height
    ]);
}

// ==================================================
// CLASSE SCENE OBJECT
// ==================================================

class SceneObjectRobo {

    constructor(vertices, color) {

        this.vertices = vertices;

        this.color = color;

        this.modelTransform =
            m3.identity();
    }

    updateModelTransform(modelTransform) {

        this.modelTransform =
            modelTransform;
    }
}

// ==================================================
// CLASSES DO ROBO
// ==================================================

class RobotPart extends SceneObjectRobo {

    constructor(width, height, color) {

        super(
            rectangleVertices_robo(
                -width / 2,
                -height,
                width,
                height
            ),
            color
        );
    }
}

class RobotEyes extends SceneObjectRobo {

    constructor(diff) {

        super(
            rectangleVertices_robo(
                -0.23 + diff,
                0.15,
                0.13,
                0.065
            ),
            new Float32Array([
                0.15,
                0.15,
                0.18
            ])
        );
    }
}

class lingua extends SceneObjectRobo {

    constructor() {

        super(
            rectangleVertices_robo(
                -0.06,
                0.037,
                0.11,
                0.044
            ),
            new Float32Array([
                0.85,
                0,
                0.67
            ])
        );
    }
}

class RobotBody extends SceneObjectRobo {

    constructor() {

        super(
            rectangleVertices_robo(
                -0.35,
                -0.25,
                0.7,
                0.6
            ),
            new Float32Array([
                0.15,
                0.15,
                0.18
            ])
        );
    }
}

class RobotHead extends SceneObjectRobo {

    constructor() {

        super(
            rectangleVertices_robo(
                -0.3,
                -0.1,                
                0.6,
                0.4
            ),
            new Float32Array([
                0.6,
                0.6,
                0.65
            ])
        );
    }
}

class Robot {

    constructor(tx, ty, speed) {

        this.tx = tx;

        this.ty = ty;

        this.speed = speed;

        this.theta = 0.0;

        this.head =
            new RobotHead();

        this.lingua =
            new lingua();

        this.body =
            new RobotBody();

        this.leftEye = 
            new RobotEyes(0);

        this.rightEye = 
            new RobotEyes(0.33);

        this.leftArm =
            new RobotPart(
                0.15,
                0.45,
                new Float32Array([0.6,0.6,0.65])
            );

        this.rightArm =
            new RobotPart(
                0.15,
                0.45,
                new Float32Array([0.6,0.6,0.65])
            );

        this.leftLeg =
            new RobotPart(
                0.18,
                0.5,
                new Float32Array([0.6,0.6,0.65])
            );

        this.rightLeg =
            new RobotPart(
                0.18,
                0.5,
                new Float32Array([0.6,0.6,0.65])
            );
    }

    move() {

        this.tx += this.speed;

        if (this.tx > 0.9 || this.tx < -0.9) {

            this.speed = -this.speed;
        }

        this.theta += 0.08;

        const bodyTransform =
            m3.translation(
                this.tx,
                this.ty
            );

        const armAngle =
            Math.sin(this.theta) * 0.5;

        const legAngle =
            Math.sin(this.theta * 1.35) * 0.6;

        this.head.updateModelTransform(
            m3.multiply(
                bodyTransform,
                m3.translation(0.0,0.35)
            )
        );

        this.lingua.updateModelTransform(
            m3.multiply(
                bodyTransform,
                m3.translation(0.0,0.35)
            )
        );

        this.body.updateModelTransform(
            bodyTransform
        );

        this.rightEye.updateModelTransform(
            m3.multiply(
                bodyTransform,
                m3.translation(0.0,0.35)
            )
        );

        this.leftEye.updateModelTransform(
            m3.multiply(
                bodyTransform,
                m3.translation(0.0,0.35)
            )
        );

        this.leftArm.updateModelTransform(
            m3.multiply(
                bodyTransform,
                m3.multiply(
                    m3.translation(-0.42,0.2),
                    m3.rotation(armAngle)
                )
            )
        );

        this.rightArm.updateModelTransform(
            m3.multiply(
                bodyTransform,
                m3.multiply(
                    m3.translation(0.42,0.2),
                    m3.rotation(-armAngle)
                )
            )
        );

        this.leftLeg.updateModelTransform(
            m3.multiply(
                bodyTransform,
                m3.multiply(
                    m3.translation(-0.18,-0.205),
                    m3.rotation(legAngle)
                )
            )
        );

        this.rightLeg.updateModelTransform(
            m3.multiply(
                bodyTransform,
                m3.multiply(
                    m3.translation(0.18,-0.205),
                    m3.rotation(legAngle)
                )
            )
        );
    }

    draw(renderer) {

        renderer.draw(this.head);
        renderer.draw(this.rightEye);
        renderer.draw(this.leftEye);
        renderer.draw(this.lingua);
        renderer.draw(this.leftLeg);
        renderer.draw(this.rightLeg);
        renderer.draw(this.body);
        renderer.draw(this.leftArm);
        renderer.draw(this.rightArm);
    }
}

// ==================================================
// CLASSE SCENE
// ==================================================

class SceneRobo {

    constructor(gl, program) {

        this.renderer =
            new RendererRobo(
                gl,
                program
            );

        this.viewTransform =
            m3.setClippingWindow(
                -1.5,
                -1.0,
                1.5,
                1.0
            );

        this.renderer.defineViewTransform(
            this.viewTransform
        );

        this.robot =
            new Robot(-0.8,-0.05,0.003);
    }

    update() {

        this.robot.move();
    }

    draw() {

        gl_robo.clear(
            gl_robo.COLOR_BUFFER_BIT
        );

        gl_robo.useProgram(
            program_robo
        );

        this.robot.draw(
            this.renderer
        );
    }

    execute() {

        this.update();

        this.draw();

        requestAnimationFrame(
            () => this.execute()
        );
    }

    init() {

        requestAnimationFrame(
            () => this.execute()
        );
    }
}

// ==================================================
// CONFIGURACAO INICIAL DO WEBGL
// ==================================================

gl_robo.clearColor(
    1.0,
    1.0,
    1.0,
    1.0
);

gl_robo.viewport(
    0,
    0,
    canvas_robo.width,
    canvas_robo.height
);

// ==================================================
// CRIAR CENA
// ==================================================

const scene_robo =
    new SceneRobo(
        gl_robo,
        program_robo
    );

// ==================================================
// INICIAR ANIMACAO
// ==================================================

scene_robo.init();
