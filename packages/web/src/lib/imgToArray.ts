// https://raw.githubusercontent.com/socathie/zkPhoto-ui/main/src/util/img2array.ts

export function getStandardPixelArray(pixelArray: Uint8ClampedArray) {
  const slicedArray = pixelArray.slice(0, 256);
  return slicedArray;
}
