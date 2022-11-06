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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0 && acceptedFiles?.[0]) {
      setVideo(acceptedFiles[0]);
    }
  }, []);

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
        disabled={!video || createStatus === 'loading'}
      >
        Upload
      </Button>
      <p>Status: {createStatus} </p>
      <p>Error: {createError?.message} </p>
    </>
  );
};

export default CreateAndViewAsset;
