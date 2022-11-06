function getCanvasFromVideo(video: HTMLVideoElement) {
  let canvas = document.createElement('canvas');
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  let ctx = canvas.getContext('2d');
  ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// Returns PNG
export function getCanvassesFromVideo(
  video: HTMLVideoElement,
  callback: Function,
) {
  //   const images: string[] = [];
  const canvasses: HTMLCanvasElement[] = [];

  video.onseeked = function (e) {
    console.log('seeked:', video.currentTime);
    let canvas = getCanvasFromVideo(video);
    // images.push(canvas.toDataURL());
    canvasses.push(canvas);

    if (canvasses.length === 3) {
      callback(canvasses as HTMLCanvasElement[]);
    }
  };

  video.onerror = function (e) {
    console.error(e);
  };

  video.onloadedmetadata = function () {
    const interval = Math.floor(video.duration / 4);
    const loop = setInterval(() => {
      if (video.currentTime >= video.duration - 2 * interval) {
        return clearInterval(loop);
      }
      video.currentTime += interval;
    }, 1000);
  };
}

export function getImageDataFromCanvas(canvas: HTMLCanvasElement) {
  //   console.log('canvas', canvas);
  const image = canvas.toDataURL();
  return image;
}

// extract pixel data from a canvas
export function getPixelData(
  canvas: HTMLCanvasElement,
): Uint8ClampedArray | undefined {
  const ctx = canvas.getContext('2d');
  const pixel = ctx?.getImageData(0, 0, canvas.width, canvas.height);
  const data = pixel?.data;
  return data;
}

/*
  const bounding = canvas.getBoundingClientRect();
  const x = event.clientX - bounding.left;
  const y = event.clientY - bounding.top;
  const pixel = ctx.getImageData(x, y, 1, 1);
  const data = pixel.data;
*/
