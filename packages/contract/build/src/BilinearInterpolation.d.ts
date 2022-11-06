import { UInt32, CircuitValue, Field } from 'snarkyjs';
export declare class BilinearInterpolation extends CircuitValue {
    value: UInt32[][][];
    d: Field;
    constructor(input: number[][][]);
    calculateBilinear(): UInt32[][][];
}
