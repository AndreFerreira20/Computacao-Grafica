// ==================================================
// CLASS - SCENE OBJECT
// ==================================================

class SceneObject {

    constructor(
        vertices,
        colors,
        indices,
        x, y, z
    ) {

        this.vertices = vertices;
        this.colors = colors;
        this.indices = indices;

        this.x = x;
        this.y = y;
        this.z = z;

        this.tx = 0.01;
        this.ty = 0.01;

        // Eixo de rotação atual
        this.rotationAxis = null;

        this.theta = 0.02;

        this.modelTransform = m4.identity();
    }

    update() {

        if (this.rotationAxis === "x") {

            this.modelTransform =
                m4.multiply(
                    m4.xRotation(this.theta),
                    this.modelTransform
                );
        }

        else if (this.rotationAxis === "y") {

            this.modelTransform =
                m4.multiply(
                    m4.yRotation(this.theta),
                    this.modelTransform
                );
        }

        else if (this.rotationAxis === "z") {

            this.modelTransform =
                m4.multiply(
                    m4.zRotation(this.theta),
                    this.modelTransform
                );
        }

    }

    updateHelices() {

        let rotacao;
        if (this.rotationAxis === "y") rotacao = m4.yRotation(this.theta);
        else rotacao = m4.zRotation(this.theta);

        const origin = m4.translation(-this.x, -this.y, -this.z);
        const moveBack = m4.translation(this.x, this.y, this.z);

        let movimento = m4.multiply(rotacao, origin);
        movimento = m4.multiply(moveBack, movimento);

        this.modelTransform = m4.multiply(movimento, this.modelTransform);
    }

    // Move o objeto uma unidade
    move(dx, dy) {

        this.tx += dx;
        this.ty += dy;

        this.x += dx;
        this.y += dy

        this.modelTransform =
            m4.multiply(
                m4.translation(dx, dy, 0.0),
                this.modelTransform
            );
    }

    updateModelTransform(modelTransform) {

        this.modelTransform =
            modelTransform;
    }

    draw(renderer) {

        renderer.draw(this);
    }
}