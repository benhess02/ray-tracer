import { Vector3 } from "./vector3";

export class Matrix3x3 {
    m11 : number;
    m12 : number;
    m13 : number;
    m21 : number;
    m22 : number;
    m23 : number;
    m31 : number;
    m32 : number;
    m33 : number;

    constructor() {
        this.reset();
    }

    reset() : this {
        this.m11 = 1;
        this.m12 = 0;
        this.m13 = 0;
        this.m21 = 0;
        this.m22 = 1;
        this.m23 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1;
        return this;
    }

    public copy() : Matrix3x3 {
        var mat = new Matrix3x3();
        mat.m11 = this.m11;
        mat.m12 = this.m12;
        mat.m13 = this.m13;
        mat.m21 = this.m21;
        mat.m22 = this.m22;
        mat.m23 = this.m23;
        mat.m31 = this.m31;
        mat.m32 = this.m32;
        mat.m33 = this.m33;
        return mat;
    }

    public setFrom(other : Matrix3x3) : this {
        this.m11 = other.m11;
        this.m12 = other.m12;
        this.m13 = other.m13;
        this.m21 = other.m21;
        this.m22 = other.m22;
        this.m23 = other.m23;
        this.m31 = other.m31;
        this.m32 = other.m32;
        this.m33 = other.m33;
        return this;
    }

    public mulN(m11 : number, m12 : number, m13 : number,
            m21 : number, m22 : number, m23 : number,
            m31 : number, m32 : number, m33 : number) : this {
        var t11 = this.m11;
        var t12 = this.m12;
        var t13 = this.m13;
        var t21 = this.m21;
        var t22 = this.m22;
        var t23 = this.m23;
        var t31 = this.m31;
        var t32 = this.m32;
        var t33 = this.m33;

        this.m11 = t11 * m11 + t12 * m21 + t13 * m31;
        this.m12 = t11 * m12 + t12 * m22 + t13 * m32;
        this.m13 = t11 * m13 + t12 * m23 + t13 * m33;

        this.m21 = t21 * m11 + t22 * m21 + t23 * m31;
        this.m22 = t21 * m12 + t22 * m22 + t23 * m32;
        this.m23 = t21 * m13 + t22 * m23 + t23 * m33;

        this.m31 = t31 * m11 + t32 * m21 + t33 * m31;
        this.m32 = t31 * m12 + t32 * m22 + t33 * m32;
        this.m33 = t31 * m13 + t32 * m23 + t33 * m33;

        return this;
    }

    public mul(other : Matrix3x3) : this {
        return this.mulN(other.m11, other.m12, other.m13,
                         other.m21, other.m22, other.m23,
                         other.m31, other.m32, other.m33)
    }

    public scaleN(x : number, y : number, z : number) : this {
        return this.mulN(x, 0, 0,
                         0, y, 0,
                         0, 0, z);
    }

    public scale(scale : Vector3) : this {
        return this.scaleN(scale.x, scale.y, scale.z);
    }

    public rotateX(r : number) : this {
        var cos_r = Math.cos(r);
        var sin_r = Math.sin(r);
        return this.mulN(1, 0, 0,
                         0, cos_r, -sin_r,
                         0, sin_r, cos_r);
    }

    public rotateY(r : number) : this {
        var cos_r = Math.cos(r);
        var sin_r = Math.sin(r);
        return this.mulN(cos_r, 0, sin_r,
                         0, 1, 0,
                         -sin_r, 0, cos_r);
    }

    public rotateZ(r : number) : this {
        var cos_r = Math.cos(r);
        var sin_r = Math.sin(r);
        return this.mulN(cos_r, -sin_r, 0,
                         sin_r, cos_r, 0,
                         0, 0, 1);
    }
}