// live peer demo stream
// v = file id
// https://lvpr.tv/?v=4bc056prm9d4p2aw

/* eslint-disable jsx-a11y/alt-text */
import { useState, useMemo, useRef, useEffect } from 'react';

import {
  Badge,
  Box,
  Button,
  Center,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Icon,
} from '@chakra-ui/react';
import {
  createReactClient,
  studioProvider,
  useAsset,
  useCreateAsset,
} from '@livepeer/react';
import ProgressBar from '@ramonak/react-progress-bar';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import CircleLoader from 'react-spinners/CircleLoader';

export const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_LIVEPEER_API_KEY,
  }),
});

type Props = {
  b64: string | undefined;
  canvasses: HTMLCanvasElement[];
  images: string[];
  setB64: Function;
  setCanvasses: Function;
  setImages: Function;
  setStep: Function;
  setVideo: Function;
  video: File | undefined;
};

const CreateAndViewAsset: React.FC<Props> = ({
  setStep,
  images,
  setImages,
  video,
  setVideo,
  b64,
  setB64,
  canvasses,
  setCanvasses,
}: Props) => {
  const [uploadProg, setUploadProg] = useState<number>(0);
  const [processProg, setProcessProg] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadDone, setUploadDone] = useState<boolean>(false);
  const [processDone, setProcessDone] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finalRef = useRef(null);
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

  const progressFormatted = useMemo(
    () =>
      uploadProgress
        ? Math.round(uploadProgress * 100)
        : asset?.status?.progress
        ? Math.round(asset?.status?.progress * 100)
        : null,
    [uploadProgress, asset?.status?.progress],
  );

  if (createStatus === 'success') {
    console.log(asset?.status);
  }

  useEffect(() => {
    if (asset?.status?.phase === 'ready') {
      setProcessDone(true);
      setTimeout(setLoading, 1000, false);
      setTimeout(setStep, 2000, 2);
    }
  }, [asset?.status?.phase]);

  useEffect(() => {
    if (!asset?.status?.progress) return;
    if (Math.round(asset?.status?.progress * 100) >= 97) {
      setProcessDone(true);
      setProcessProg(100);
      return;
    }
    setProcessProg(Math.round(asset?.status?.progress * 100));
  }, [asset?.status?.progress]);

  useEffect(() => {
    if (!uploadProgress) return;
    if (Math.round(uploadProgress * 100) >= 97) {
      setUploadDone(true);
      setUploadProg(100);
      return;
    }
    setUploadProg(Math.round(uploadProgress * 100));
  }, [uploadProgress]);

  return (
    <>
      <Box ref={finalRef}>
        <Modal
          finalFocusRef={finalRef}
          isOpen={loading}
          onClose={() => {
            setLoading(false);
          }}
        >
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent
            bg="white"
            w="90%"
            h="500px"
            borderRadius="20px"
            top="100px"
          >
            <ModalBody paddingInline="0">
              <Box mt="20px">
                <Text
                  color="black"
                  textAlign="center"
                  fontWeight="bold"
                  fontSize="25px"
                >
                  Uploading the video to Livepeer...
                  <br />
                  This might take time.
                </Text>
                <Center w="100%" mt="40px" mb="40px">
                  <CircleLoader
                    color="#EE6C4D"
                    loading={loading}
                    size={80}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </Center>
                <Center>
                  <Text color="black">Upload:&nbsp;&nbsp;</Text>
                  <ProgressBar
                    //@ts-ignore
                    width="300px"
                    height="25px"
                    margin="20px 0"
                    completed={uploadProg ? uploadProg : 0}
                    maxCompleted={100}
                    customLabel={uploadProg ? `${uploadProg}%` : '100%'}
                    bgColor="#EE6C4D"
                    baseBgColor="#FBD28D"
                  />
                  <Icon
                    ml="5px"
                    w="20px"
                    h="20px"
                    color="#039D06"
                    opacity={uploadDone ? '1' : '0'}
                    as={AiOutlineCheckCircle}
                  />
                </Center>
                <Center>
                  <Text color="black">Process:&nbsp;&nbsp;</Text>
                  <ProgressBar
                    //@ts-ignore
                    width="300px"
                    height="25px"
                    completed={processProg ? processProg : 0}
                    maxCompleted={100}
                    customLabel={processProg ? `${processProg}%` : '100%'}
                    bgColor="#EE6C4D"
                    baseBgColor="#FBD28D"
                  />
                  <Icon
                    ml="5px"
                    w="20px"
                    h="20px"
                    color="#039D06"
                    opacity={processDone ? '1' : '0'}
                    as={AiOutlineCheckCircle}
                  />
                </Center>
                <Center>
                  <Button
                    mt="50px"
                    color="black"
                    bg="white"
                    border="1px solid black"
                    borderRadius="30px"
                    w="90%"
                    h="60px"
                    fontSize="xl"
                    mb="30px"
                    onClick={() => {
                      setLoading(false);
                    }}
                  >
                    Close
                  </Button>
                </Center>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
        {b64 && (
          <Center w="100%" p="0 20%">
            <video id="video" ref={videoRef} src={b64} controls />
          </Center>
        )}
        {createError?.message && <Text>{createError.message}</Text>}

        <Center>
          <Box>
            <Center>
              {video ? (
                <>
                  <Badge>{video.name}</Badge>
                  <br />
                </>
              ) : (
                <>
                  <Text>Select a video to upload.</Text>
                  <br />
                </>
              )}
            </Center>
            {/* {progressFormatted && <Text>{progressFormatted}</Text>} */}

            <Center>
              <Button
                mt="20px"
                w="200px"
                onClick={() => {
                  if (video) {
                    setLoading(true),
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
            </Center>
          </Box>
        </Center>
      </Box>
    </>
  );
};

export default CreateAndViewAsset;
