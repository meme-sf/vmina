import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { Badge, Box, Button, Center, Text , Input, Icon, Image, Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import {
  getCanvassesFromVideo,
  getImageDataFromCanvas,
  getPixelData,
} from '../../lib/image';
import { getStandardPixelArray } from 'lib/imgToArray';
import { BsFillCloudUploadFill } from 'react-icons/bs'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CircleLoader from 'react-spinners/CircleLoader'

type Props = {
  setStep: Function
  b64: string | undefined
  setB64: Function
  pathnames: string[]
  setVideo: Function
  canvasses: HTMLCanvasElement[]
  setCanvasses: Function
  setImages: Function
}

const Thumbnails: React.FC<Props> = ({ setStep, b64, setB64, pathnames, setVideo, canvasses, setCanvasses, setImages }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef(null);
  const sliderRef = useRef(null);
  const finalRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
  };

  const onDrop = useCallback(([video]: File[]) => {
    setLoading(true)
    setVideo(video);
    let reader = new FileReader();
    reader.readAsDataURL(video);
    if (typeof window === 'undefined' || !video) return;
    reader.onload = () => {
      setB64(reader.result as string);
    };
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4'],
    },
    maxFiles: 1,
    onDrop,
  });

  useEffect(() => {
    if (!videoRef.current) return;
    getCanvassesFromVideo(
      videoRef.current,
      (canvasses: HTMLCanvasElement[]) => {
        // console.log('canvasses', canvasses);
        setCanvasses(canvasses);
      },
    );

    // getImageDataFromCanvas
    if (canvasses?.length < 3) return;
    const images: string[] = [];
    canvasses.map((canvas) => {
      const imageData = getImageDataFromCanvas(canvas);
      // console.log('imageData', imageData);
      images.push(imageData);
    });
    setImages(images);
  }, [b64, canvasses]);

  useEffect(() => {
    if (!canvasses?.length) return;
    const pixelData = getPixelData(canvasses[1]);
    if (!pixelData) return;
    console.log('pixel data', getStandardPixelArray(pixelData));
  }, [canvasses]);

  useEffect(() => {
    if(pathnames.length < 3) return
    setLoading(false)
  }, [pathnames])

  return (
    <>
      <Box ref={finalRef}>
        <Modal finalFocusRef={finalRef} isOpen={loading} onClose={() => {setLoading(false)}}>
          <ModalOverlay backdropFilter='blur(5px)' />
          <ModalContent bg='white' w='90%' h='400px' borderRadius='20px' top='100px'>
            <ModalBody paddingInline='0'>
              <Box mt='20px'>
                <Text color='black' textAlign='center' fontWeight='bold' fontSize='25px'>
                  Uploading the Thumbnails to IPFS...
                  This might take time.
                </Text>
                <Center w='100%' mt='40px' mb='40px'>
                  <CircleLoader
                    color='#EE6C4D'
                    loading={loading}
                    size={80}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </Center>
                <Center>
                  <Button
                    mt='50px'
                    color='black'
                    bg='white'
                    border='1px solid black'
                    borderRadius='30px'
                    w='90%'
                    h='60px'
                    fontSize='xl'
                    mb='30px'
                    onClick={() => {setLoading(false)}}
                  >
                    Close
                  </Button>
                </Center>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
        {pathnames.length < 3 ? (
          <Center {...getRootProps()} w='100%' h='400px' p='0 20%'>
            <Center bg='#F0F0F0' h='100%' w='100%' border='1px dotted #CACACA'
              //@ts-ignore
              onClick={() => {inputRef.current ? inputRef.current.click() : null}}>
              <Box as={Input} hidden ref={inputRef} {...getInputProps()} />
              <Box>
                <Text color='#777777'>Drag and drop your video here</Text>
                <Center>
                  <Icon mt='20px' textAlign='center' color='#777777' fontSize='40px' as={BsFillCloudUploadFill} />
                </Center>
              </Box>
            </Center>
          </Center>
        ) : (
          <>
            <Slider ref={sliderRef} {...settings}>
              {pathnames.map((val: string, key: number) => {
                return (
                  <Center key={key} w="100%" p='0 20%'>
                    <Box m="0 auto">
                      <Image
                        src={`https://ipfs.io/ipfs${val}`}
                        alt="image test"
                        key={key}
                      />
                    </Box>
                  </Center>
                );
              })}
            </Slider>
            <Center mt='50px'>
              <Button onClick={() => {setStep(1)}}>
                Go to next step
              </Button>
            </Center>
          </>
        )}
        {b64 && (
          <div>
            <video hidden id="video" ref={videoRef} src={b64} controls />
          </div>
        )}
      </Box>
    </>
  )
}

export default Thumbnails
