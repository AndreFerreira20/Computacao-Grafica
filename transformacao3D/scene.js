// ==================================================
// CLASS - SCENE
// ==================================================

class Scene {

    constructor(gl, program) {

        this.renderer =
            new Renderer(gl, program);

        // Figura que será exibida
        this.corpo =
        new SceneObject(
            helicopteroGeometry.vertices,
            helicopteroGeometry.colors,
            helicopteroGeometry.indices,
        );

        this.heliceMaior = 
        new SceneObject(
            heliceMaiorGeometry.vertices,
            heliceMaiorGeometry.colors,
            heliceMaiorGeometry.indices,
        )

        this.heliceMenor = 
        new SceneObject(
            heliceMenorGeometry.vertices,
            heliceMenorGeometry.colors,
            heliceMenorGeometry.indices,
        )
        
        this.setupKeyboard();
    }

    setupKeyboard() {

        document.addEventListener(
            "keydown",
            (event) => {

                switch (event.key) {

                    case "x": 
                        this.corpo.rotationAxis = "x"; 
                        break; 
                    
                    case "y": 
                        this.corpo.rotationAxis = "y"; 
                        break; 
                    
                    case "z": 
                        this.corpo.rotationAxis = "z";
                        break;

                    case "ArrowRight":
                        this.corpo.move(0.05, 0.0);
                        break;

                    case "ArrowLeft":
                        this.corpo.move(-0.05, 0.0);
                        break;

                    case "ArrowUp":
                        this.corpo.move(0.0, 0.05);
                        break;

                    case "ArrowDown":
                        this.corpo.move(0.0, -0.05);
                        break;

                }
            }
        );
    }

    // changeObject(geometry) {

    //     this.corpo.vertices =
    //         geometry.vertices;

    //     this.corpo.colors =
    //         geometry.colors;

    //     this.corpo.indices =
    //         geometry.indices;
    // }

    update() {

        this.corpo.update();
        this.heliceMaior.update();
        this.heliceMenor.update();
    }

    draw() {

        gl.clear(
            gl.COLOR_BUFFER_BIT |
            gl.DEPTH_BUFFER_BIT
        );

        gl.useProgram(program);

        this.corpo.draw(
            this.renderer
        );

        this.heliceMaior.draw(
            this.renderer
        );

        this.heliceMenor.draw(
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

