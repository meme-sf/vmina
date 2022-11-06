// live peer demo stream
// v = file id
// https://lvpr.tv/?v=4bc056prm9d4p2aw

/* eslint-disable jsx-a11y/alt-text */
import { useCallback, useState, useMemo } from 'react';

import { Badge, Box, Button, Text } from '@chakra-ui/react';
import {
  createReactClient,
  studioProvider,
  useAsset,
  useCreateAsset,
} from '@livepeer/react';
import { useDropzone } from 'react-dropzone';

export const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_LIVEPEER_API_KEY,
  }),
});

const CreateAndViewAsset = () => {
  const [video, setVideo] = useState<File | undefined>();
  const [b64, setB64] = useState<string | undefined>();
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
    if (reader.readyState === 2) {
      setB64(reader.result as string);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4'],
    },
    maxFiles: 1,
    onDrop,
  });

  //here `window` is available
  if (typeof window !== 'undefined' && video) {
    let reader = new FileReader();
    reader.readAsDataURL(video);
    reader.onload = () => {
      console.log({
        src: video,
        data: reader.result,
      });
      if (reader.readyState === 2) {
        setB64(reader.result as string);
      }
    };
  }

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
      <p>
        {b64 && (
          <div>
            <Text>Select a video to upload.</Text>
            <video src={b64} controls />
          </div>
        )}
      </p>
    </>
  );
};

export default CreateAndViewAsset;
