import { matrixProp, UInt32, CircuitValue, prop, Field } from 'snarkyjs';

export class BilinearInterpolation extends CircuitValue {
  @matrixProp(UInt32, 256, 256) value: UInt32[][][];
  @prop d: Field;

  constructor(input: number[][][]) {
    super();
    this.value = input.map((row) =>
      row.map((val) => val.map((v) => UInt32.from(v))),
    );
  }

  calculateBilinear(): UInt32[][][] {
    const input = this.value;
    const output: UInt32[][][] = [];

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
