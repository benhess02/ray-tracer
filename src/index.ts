import { Matrix3x3 } from "./matrix3x3";
import { Renderer } from "./renderer";
import { Vector3 } from "./vector3";

var canvas = <HTMLCanvasElement>document.getElementById("cvs");
var renderer = new Renderer(canvas);

var infoText = <HTMLSpanElement>document.getElementById("info-text");

var keys : string[] = [];

var lastTime : DOMHighResTimeStamp = -1 / 60;

var cameraPosition = new Vector3();
var yaw = 0;
var pitch = 0;

function update(time : DOMHighResTimeStamp) {
    requestAnimationFrame((t) => update(t));

    var dt = (time - lastTime) / 1000;
    lastTime = time;

    var updateRotation = false;
    if(keys.includes("q")) {
        yaw -= dt;
        updateRotation = true;
    }
    if(keys.includes("e")) {
        yaw += dt;
        updateRotation = true;
    }
    if(keys.includes("r")) {
        pitch -= dt;
        updateRotation = true;
    }
    if(keys.includes("f")) {
        pitch += dt;
        updateRotation = true;
    }
    if(updateRotation) {
        renderer.setViewMatrix(new Matrix3x3().rotateY(yaw).rotateX(pitch));
    }

    var movement = new Vector3();
    if(keys.includes("w")) {
        movement.addN(0, 0, 1);
    }
    if(keys.includes("s")) {
        movement.addN(0, 0, -1);
    }
    if(keys.includes("a")) {
        movement.addN(-1, 0, 0);
    }
    if(keys.includes("d")) {
        movement.addN(1, 0, 0);
    }

    if(movement.magSq() > 0) {
        movement.apply(new Matrix3x3().rotateY(yaw));
    }

    if(keys.includes(" ")) {
        movement.addN(0, 1, 0);
    }
    if(keys.includes("Shift")) {
        movement.addN(0, -1, 0);
    }

    if(movement.magSq() > 0) {
        movement.norm().mul(dt);
        cameraPosition.add(movement);
        renderer.setCameraPosition(cameraPosition);
    }
    renderer.render();

    infoText.innerText = "Movement controls: W, A, S, D, Shift, Space\n"
        + "Rotation controls: Q, E, R, F\n"
        + "FPS: " + (1 / dt).toFixed(1);
}

function updateSize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

document.addEventListener("keydown", (ev) => {
    if(!keys.includes(ev.key)) {
        keys.push(ev.key);
    }
});

document.addEventListener("keyup", (ev) => {
    var index = keys.indexOf(ev.key);
    if(index >= 0) {
        keys.splice(index, 1);
    }
});

window.addEventListener("resize", () => updateSize());

update(0);
updateSize();