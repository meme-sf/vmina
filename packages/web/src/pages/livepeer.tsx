// live peer demo stream
// v = file id
// https://lvpr.tv/?v=4bc056prm9d4p2aw

/* eslint-disable jsx-a11y/alt-text */
import { useCallback, useState, useMemo, useRef, useEffect } from 'react';

import { Badge, Box, Button, Text } from '@chakra-ui/react';
import {
  createReactClient,
  studioProvider,
  useAsset,
  useCreateAsset,
} from '@livepeer/react';
import { useDropzone } from 'react-dropzone';

import { getVideoImages } from '../lib/image';

export const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_LIVEPEER_API_KEY,
  }),
});

const CreateAndViewAsset = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<File | undefined>();
  const [b64, setB64] = useState<string | undefined>();
  // PNG
  const [images, setImages] = useState<string[]>([]);
  const {
    mutate: createAsset,
    data: createdAsset,
    status: createStatus,
    error: createError,
    uploadProgress,
  } = useCreateAsset();
  const { data: asset, status: assetStatus } = useAsset({
    assetId: createdAsset?.id,
    refetchInterval: (asset) =>
      asset?.status?.phase !== 'ready' ? 3000 : false,
  });

  const onDrop = useCallback(([video]: File[]) => {
    setVideo(video);
    let reader = new FileReader();
    reader.readAsDataURL(video);
    if (typeof window === 'undefined' || !video) return;
    reader.onload = () => {
      setB64(reader.result as string);
    };
  }, []);

  // @LUKA: this is where we can get the images from the video
  useEffect(() => {
    if (!videoRef.current) return;
    getVideoImages(videoRef.current, (images: string[]) => {
      console.log('images', images);
      setImages(images);
    });
  }, [b64]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4'],
    },
    maxFiles: 1,
    onDrop,
  });

  const progressFormatted = useMemo(
    () =>
      uploadProgress
        ? `Uploading: ${Math.round(uploadProgress * 100)}%`
        : asset?.status?.progress
        ? `Processing: ${Math.round(asset?.status?.progress * 100)}%`
        : null,
    [uploadProgress, asset?.status?.progress],
  );

  if (createStatus === 'success') {
    console.log(asset?.status);
  }

  return (
    <>
      <Box {...getRootProps()}>
        <Box as="input" {...getInputProps()} />
        <Text>Drag and drop your video here</Text>
      </Box>

      {createError?.message && <Text>{createError.message}</Text>}

      {video ? (
        <Badge>{video.name}</Badge>
      ) : (
        <Text>Select a video to upload.</Text>
      )}
      {progressFormatted && <Text>{progressFormatted}</Text>}

      <Button
        onClick={() => {
          if (video) {
            createAsset({
              name: video.name,
              file: video,
            });
          }
        }}
        disabled={
          !video ||
          createStatus === 'loading' ||
          (asset?.status?.phase && asset?.status?.phase !== 'ready')
        }
      >
        Upload
      </Button>
      <p>Status: {createStatus} </p>
      <p>Error: {createError?.message} </p>
      {b64 && (
        <div>
          <Text>Select a video to upload.</Text>
          <video id="video" ref={videoRef} src={b64} controls />
        </div>
      )}
      {images && images.map((image, i) => <img key={i} src={image} />)}
    </>
  );
};

export default CreateAndViewAsset;
