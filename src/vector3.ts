import { Matrix3x3 } from "./matrix3x3";

export class Vector3 {
    public x : number;
    public y : number;
    public z : number;

    constructor(x : number = 0, y : number = 0, z : number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public copy() : Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    public set(x : number, y : number, z : number) : this {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    public setFrom(other : Vector3) : this {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }

    public magSq() : number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    public mag() : number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public norm() : this {
        return this.div(this.mag());
    }

    public dot(other : Vector3) : number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    public add(other : Vector3) : this {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    public addN(x : number, y : number, z : number) : this {
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }

    public sub(other : Vector3) : this {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    public subN(x : number, y : number, z : number) : this {
        this.x -= x;
        this.y -= y;
        this.z -= z;
        return this;
    }

    public mul(n : number) : this {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }

    public mulVec(other : Vector3) : this {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    }

    public div(n : number) : this {
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    }

    public divVec(other : Vector3) : this {
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        return this;
    }

    public apply(matrix : Matrix3x3) : this {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        this.x = matrix.m11 * x + matrix.m12 * y + matrix.m13 * z;
        this.y = matrix.m21 * x + matrix.m22 * y + matrix.m23 * z;
        this.z = matrix.m31 * x + matrix.m32 * y + matrix.m33 * z;
        return this;
    }
}