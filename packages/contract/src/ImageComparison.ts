// import { arrayProp } from 'snarkyjs';
import {
  DeployArgs,
  method,
  Permissions,
  SmartContract,
  Bool,
  state,
  State,
  CircuitValue,
  Field,
  matrixProp,
  UInt32,
} from 'snarkyjs';
import { BilinearInterpolation } from './BilinearInterpolation.js';

export class RGBArray extends CircuitValue {
  @matrixProp(UInt32, 256, 256) value: UInt32[][][];

  constructor(input: number[][][]) {
    super();
    this.value = input.map((row) =>
      row.map((val) => val.map((v) => UInt32.from(v))),
    );
  }
}

/**
 * A smart contract that verifies the ownership of the original Image
 * Prove such that the image was downsamples to a known low-res image with a high-res image without revealing the actual high-res image
 */
export class ImageComparison extends SmartContract {
  @state(Bool) isVerified = State<Bool>();

  deploy(args: DeployArgs) {
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
  @method verifyImage(original: BilinearInterpolation, lowRes: RGBArray) {
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
