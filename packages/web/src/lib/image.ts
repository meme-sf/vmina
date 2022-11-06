var secs: number;

export function getVideoImage(path: string, secs: number) {
  let video = document.createElement('video');
  console.log('VIDEO ELEMENT:', video);

  video.onloadedmetadata = function () {
    if ('function' === typeof secs) {
      secs = Math.floor(video.duration);
    }
    video.currentTime = Math.min(
      Math.max(0, (secs < 0 ? video.duration : 0) + secs),
      video.duration,
    );
  };
  video.onseeked = function (e) {
    var canvas = document.createElement('canvas');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    var ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    var img = new Image();
    img.src = canvas.toDataURL();
    // callback.call(video, img, video.currentTime, e);
  };
  video.onerror = function (e) {
    // callback.call(video, undefined, undefined, e);
    console.error(e);
  };
  video.src = path;
}

// write a function that takes a video file and returns a list of 3 images
// with the interval of 1/3 of the video duration
// the images should be in the same order as the video

export function getFramesForVideo(videoFile: any) {
  const images: string[] = [''];
  const video = document.createElement('video');
  video.src = videoFile;
  video.onloadedmetadata = function () {
    const duration = video.duration;
    const interval = duration / 3;
    for (let i = 0; i < 3; i++) {
      const canvas = document.createElement('canvas');
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const img = new Image();
      img.src = canvas.toDataURL(); // png
      images.push(img.src);
      video.currentTime = Math.min(
        Math.max(0, (interval < 0 ? video.duration : 0) + interval),
        video.duration,
      );
    }
    return images;
  };
}

// take the function getFramesForVideo and make it work
