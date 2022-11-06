import { DeployArgs, SmartContract, Bool, State, CircuitValue, UInt32 } from 'snarkyjs';
import { BilinearInterpolation } from './BilinearInterpolation.js';
export declare class RGBArray extends CircuitValue {
    value: UInt32[][][];
    constructor(input: number[][][]);
}
/**
 * A smart contract that verifies the ownership of the original Image
 * Prove such that the image was downsamples to a known low-res image with a high-res image without revealing the actual high-res image
 */
export declare class ImageComparison extends SmartContract {
    isVerified: State<Bool>;
    deploy(args: DeployArgs): void;
    /**
     * Verify Image
     * @param original Original image data in array of byte32 256 * 256 * 3 (rbg)
     * @param lowRes compressed image data in array of byte32 128 * 128 * 3 (rbg)
     */
    verifyImage(original: BilinearInterpolation, lowRes: RGBArray): void;
}
