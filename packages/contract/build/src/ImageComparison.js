var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// import { arrayProp } from 'snarkyjs';
import { method, Permissions, SmartContract, Bool, state, State, CircuitValue, matrixProp, UInt32, } from 'snarkyjs';
import { BilinearInterpolation } from './BilinearInterpolation.js';
export class RGBArray extends CircuitValue {
    constructor(input) {
        super();
        this.value = input.map((row) => row.map((val) => val.map((v) => UInt32.from(v))));
    }
}
__decorate([
    matrixProp(UInt32, 256, 256),
    __metadata("design:type", Array)
], RGBArray.prototype, "value", void 0);
/**
 * A smart contract that verifies the ownership of the original Image
 * Prove such that the image was downsamples to a known low-res image with a high-res image without revealing the actual high-res image
 */
export class ImageComparison extends SmartContract {
    constructor() {
        super(...arguments);
        this.isVerified = State();
    }
    deploy(args) {
        super.deploy(args);
        this.setPermissions({
            ...Permissions.default(),
            editState: Permissions.proofOrSignature(),
        });
    }
    /**
     * Verify Image
     * @param original Original image data in array of byte32 256 * 256 * 3 (rbg)
     * @param lowRes compressed image data in array of byte32 128 * 128 * 3 (rbg)
     */
    verifyImage(original, lowRes) {
        // conduct Bilinear interpolation in the circuit
        const compressed = original.calculateBilinear();
        // checking value matches(TODO: check more strictly)
        compressed[0][0][0].assertEquals(lowRes.value[0][0][0]);
        compressed[0][0][1].assertEquals(lowRes.value[0][0][1]);
        compressed[0][0][2].assertEquals(lowRes.value[0][0][2]);
        // all checks passed => the
        this.isVerified.set(Bool(true));
    }
}
__decorate([
    state(Bool),
    __metadata("design:type", Object)
], ImageComparison.prototype, "isVerified", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BilinearInterpolation, RGBArray]),
    __metadata("design:returntype", void 0)
], ImageComparison.prototype, "verifyImage", null);
