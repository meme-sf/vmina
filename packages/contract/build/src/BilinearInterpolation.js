var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { matrixProp, UInt32, CircuitValue, prop, Field } from 'snarkyjs';
export class BilinearInterpolation extends CircuitValue {
    constructor(input) {
        super();
        this.value = input.map((row) => row.map((val) => val.map((v) => UInt32.from(v))));
    }
    calculateBilinear() {
        const input = this.value;
        const output = [];
        for (let i = 0; i < 256; i += 2) {
            const v = [];
            for (let j = 0; j < 256; j += 2) {
                v.push([
                    input[i][j][0]
                        .add(input[i][j + 1][0])
                        .add(input[i + 1][j][0])
                        .add(input[i + 1][j + 1][0])
                        .div(4),
                    input[i][j][1]
                        .add(input[i][j + 1][1])
                        .add(input[i + 1][j][1])
                        .add(input[i + 1][j + 1][1])
                        .div(4),
                    input[i][j][2]
                        .add(input[i][j + 1][2])
                        .add(input[i + 1][j][2])
                        .add(input[i + 1][j + 1][2])
                        .div(4),
                ]);
            }
            output.push(v);
        }
        return output;
    }
}
__decorate([
    matrixProp(UInt32, 256, 256),
    __metadata("design:type", Array)
], BilinearInterpolation.prototype, "value", void 0);
__decorate([
    prop,
    __metadata("design:type", Field)
], BilinearInterpolation.prototype, "d", void 0);
