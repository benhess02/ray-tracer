import { Vector3 } from "./vector3";

import { raytracerVertex, raytracerFragment } from "./shaders";
import { Matrix3x3 } from "./matrix3x3";

export class Renderer {

    private canvas : HTMLCanvasElement;
    private gl : WebGL2RenderingContext;
    private vertexBuffer : WebGLBuffer;

    private cameraPosition : Vector3 = new Vector3();
    private viewMatrix : Matrix3x3 = new Matrix3x3();

    private raytracerProgram : WebGLProgram;

    private sizeLocation : WebGLUniformLocation;
    private cameraPositionLocation : WebGLUniformLocation;
    private cameraViewLocation : WebGLUniformLocation;
    private sceneLocation : WebGLUniformLocation;
    private triangleCountLocation : WebGLUniformLocation;

    private sceneTexture : WebGLTexture;
    private triangleCount : number;

    private width : number = -1;
    private height : number = -1;

    constructor(canvas : HTMLCanvasElement) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2");
        if(!this.gl) {
            throw new Error("Cannot create WebGL2 context.");
        }
        this.initVertexBuffer();
        this.initTextures();
        this.initShaders();
    }

    private initVertexBuffer() : void {
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1,
                1, -1,
                1, 1,
                1, 1,
                -1, 1,
                -1, -1
            ]), this.gl.STATIC_DRAW);
    }

    private initTextures() {
        this.sceneTexture = this.createTexture(false);
    }

    private createTexture(filter : boolean) : WebGLTexture {
        var filterMode = filter ? this.gl.LINEAR : this.gl.NEAREST;
        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, filterMode);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, filterMode);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        return texture;
    }

    private initShaders() : void {
        this.raytracerProgram = this.buildShaderProgram(raytracerVertex, raytracerFragment);
        this.sizeLocation = this.gl.getUniformLocation(this.raytracerProgram, "size");
        this.cameraPositionLocation = this.gl.getUniformLocation(this.raytracerProgram, "cameraPosition");
        this.cameraViewLocation = this.gl.getUniformLocation(this.raytracerProgram, "cameraView");
        this.sceneLocation = this.gl.getUniformLocation(this.raytracerProgram, "scene");
        this.triangleCountLocation = this.gl.getUniformLocation(this.raytracerProgram, "triangleCount");
    }

    private buildShaderProgram(vertexSource : string, fragmentSource : string) : WebGLProgram {
        var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vertexShader, vertexSource);
        this.gl.compileShader(vertexShader);
        if(!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            throw new Error("Failed to compile vertex shader: " + this.gl.getShaderInfoLog(vertexShader));
        }

        var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fragmentShader, fragmentSource);
        this.gl.compileShader(fragmentShader);
        if(!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
            throw new Error("Failed to compile fragment shader: " + this.gl.getShaderInfoLog(fragmentShader));
        }

        var program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        if(!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw new Error("Failed to link program: " + this.gl.getProgramInfoLog(program));
        }
        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);

        var positionLocation = this.gl.getAttribLocation(program, "position");
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(positionLocation);

        return program;
    }

    private checkSize() : void {
        if(this.canvas.width === this.width && this.canvas.height === this.height) {
            return;
        }
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.gl.viewport(0, 0, this.width, this.height);
    }

    public setCameraPosition(position : Vector3) : void {
        this.cameraPosition.setFrom(position);
    }

    public setViewMatrix(viewMatrix : Matrix3x3) : void {
        this.viewMatrix.setFrom(viewMatrix);
    }

    public setScene(vertices : Vector3[]) : void {
        if(vertices.length % 3 !== 0) {
            throw new Error("Vertex count was not divisible by 3");
        }
        this.triangleCount = vertices.length / 3;
        var data = new Float32Array(vertices.length * 3);
        for(var i = 0; i < vertices.length; i++) {
            data[i * 3] = vertices[i].x;
            data[i * 3 + 1] = vertices[i].y;
            data[i * 3 + 2] = vertices[i].z;
        }
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.sceneTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB32F,
            3, this.triangleCount, 0, this.gl.RGB, this.gl.FLOAT, data);
    }

    public render() : void {
        this.checkSize();

        this.gl.useProgram(this.raytracerProgram);
        this.gl.uniform2f(this.sizeLocation, this.width, this.height);
        this.gl.uniform3f(this.cameraPositionLocation,
            this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
        this.gl.uniformMatrix3fv(this.cameraViewLocation, false, [
            this.viewMatrix.m11, this.viewMatrix.m21, this.viewMatrix.m31,
            this.viewMatrix.m12, this.viewMatrix.m22, this.viewMatrix.m32, 
            this.viewMatrix.m13, this.viewMatrix.m23, this.viewMatrix.m33
        ]);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.sceneTexture);
        this.gl.uniform1i(this.sceneLocation, 0);
        this.gl.uniform1i(this.triangleCountLocation, this.triangleCount);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}