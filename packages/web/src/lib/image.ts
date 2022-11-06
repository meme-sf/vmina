var secs: number;

export function getVideoImage(video: HTMLVideoElement, callback: Function) {
  const images: string[] = [];

  video.onseeked = function (e) {
    console.log('seeked:', video.currentTime);
    var canvas = document.createElement('canvas');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    var ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    images.push(canvas.toDataURL());

    if (images.length === 3) {
      callback(images);
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
