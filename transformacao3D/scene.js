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
            0, 0.255, 0
        )

        this.heliceMenor = 
        new SceneObject(
            heliceMenorGeometry.vertices,
            heliceMenorGeometry.colors,
            heliceMenorGeometry.indices,
            -0.9, 0, 0.13
        )
        
        this.setupKeyboard();
    }

    setupKeyboard() {

        document.addEventListener(
            "keydown",
            (event) => {

                switch (event.key) {

                    case "ArrowRight":
                        this.corpo.move(0.05, 0.0);
                        this.heliceMaior.move(0.05, 0.0);
                        this.heliceMenor.move(0.05, 0.0);
                        break;

                    case "ArrowLeft":
                        this.corpo.move(-0.05, 0.0);
                        this.heliceMaior.move(-0.05, 0.0);
                        this.heliceMenor.move(-0.05, 0.0);
                        break;

                    case "ArrowUp":
                        this.corpo.move(0.0, 0.05);
                        this.heliceMaior.move(0.0, 0.05);
                        this.heliceMenor.move(0.0, 0.05);
                        break;

                    case "ArrowDown":
                        this.corpo.move(0.0, -0.05);
                        this.heliceMaior.move(0.0, -0.05);
                        this.heliceMenor.move(0.0, -0.05);
                        break;

                }
            }
        );
    }


    update() {

        this.corpo.update();
        this.heliceMaior.updateHelices();
        this.heliceMenor.updateHelices();
    }

    draw() {

        this.heliceMaior.rotationAxis = "y";
        this.heliceMenor.rotationAxis = "z";

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

