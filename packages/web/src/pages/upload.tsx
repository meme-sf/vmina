import { Center, Divider, Icon } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { NFTStorage, File } from 'nft.storage';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CreateAndViewAsset from '../components/upload/livepeer'
import Thumbnails from 'components/upload/thumbnails';
import { AiOutlineCheckCircle } from 'react-icons/ai'
import Verify from 'components/upload/verify';
import Confirm from 'components/upload/confirm';

const Upload = () => {
  const client = new NFTStorage({
    token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || '',
  });
  const [pathnames, setPathnames] = useState<string[]>([]);
  const [step, setStep] = useState<number>(0)
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<File | undefined>();
  const [b64, setB64] = useState<string | undefined>();
  const [canvasses, setCanvasses] = useState<HTMLCanvasElement[]>([]);

  const dataURLtoFile = (dataurl: string, filename: string) => {
    var arr = dataurl.split(','),
    //@ts-ignore
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
}

  const handleIPFS = async (file: any) => {
    console.log(file);
    const metadata = await client.store({
      name: 'Pinpie',
      description: 'Pin is not delicious beef!',
      image: new File([file], file.name, { type: file.type }),
    });
    console.log(metadata.data.image.pathname);
    setPathnames((prevState) => [...prevState, metadata.data.image.pathname]);
  };

  const handleUpload = async (images: string[]) => {
    console.log(images);
    images.map((val: any, key: any) => {
      handleIPFS(dataURLtoFile(val, 'lowresimg.png'));
    });
  };

  useEffect(() => {
    if(images.length === 0) return
    handleUpload(images)
  }, [images])
  return (
    <>
      <Center mt="40px" mb="40px">
        <Center bg='white' color={step >= 0 ? '#039D06' : 'black'} borderRadius='500px' w='60px' h='60px' fontSize='20px' fontWeight='bold' border={step >= 0 ? '2px solid #039D06' : ''}>
          {step >= 1 ? (
            <Icon w='70px' h='70px' color='#039D06' as={AiOutlineCheckCircle} />
          ) : (
            1
          )}
        </Center>
        <Divider w='5%' borderColor={step >= 1 ? '#039D06' : 'white'} borderWidth='2px' opacity='1' />
        <Center bg='white' color={step >= 1 ? '#039D06' : 'black'} borderRadius='500px' w='60px' h='60px' fontSize='20px' fontWeight='bold' border={step === 1 ? '2px solid #039D06' : ''}>
          {step >= 2 ? (
            <Icon w='70px' h='70px' color='#039D06' as={AiOutlineCheckCircle} />
          ) : (
            2
          )}
        </Center>
        <Divider w='5%' borderColor={step >= 2 ? '#039D06' : 'white'} borderWidth='2px' opacity='1' />
        <Center bg='white' color={step >= 2 ? '#039D06' : 'black'} borderRadius='500px' w='60px' h='60px' fontSize='20px' fontWeight='bold' border={step === 2 ? '2px solid #039D06' : ''}>
          {step >= 3 ? (
            <Icon w='70px' h='70px' color='#039D06' as={AiOutlineCheckCircle} />
          ) : (
            3
          )}
        </Center>
        <Divider w='5%' borderColor={step >= 3 ? '#039D06' : 'white'} borderWidth='2px' opacity='1' />
        <Center bg='white' color={step >= 3 ? '#039D06' : 'black'} borderRadius='500px' w='60px' h='60px' fontSize='20px' fontWeight='bold' border={step === 3 ? '2px solid #039D06' : ''}>
          4
        </Center>
      </Center>
      {step === 0 ? (
        <>
          <Center fontSize='20px' mb='20px'>
            Step 1 : Generate and upload Thumbnails to IPFS
          </Center>
          <Thumbnails
            setStep={setStep}
            b64={b64}
            setB64={setB64}
            pathnames={pathnames}
            setVideo={setVideo}
            canvasses={canvasses}
            setCanvasses={setCanvasses}
            setImages={setImages}
          />
        </>
      ) : step === 1 ? (
        <>
          <Center fontSize='20px' mb='20px'>
            Step 2 : Upload Video to Livepeer
          </Center>
          <CreateAndViewAsset
            setStep={setStep}
            images={images}
            setImages={setImages}
            video={video}
            setVideo={setVideo}
            b64={b64}
            setB64={setB64}
            canvasses={canvasses}
            setCanvasses={setCanvasses}
          />
        </>
      ) : step === 2 ? (
        <>
          <Center fontSize='20px' mb='20px'>
            Step 3 : Verify Proof on Mina
          </Center>
          <Verify
            setStep={setStep}
            pathnames={pathnames}
            b64={b64}
          />
        </>
      ) : (
        <>
          <Center fontSize='20px' mb='20px'>
            Step 4 : Confirm
          </Center>
          <Confirm
            pathnames={pathnames}
          />
        </>
      )}
    </>
  );
};

export default Upload;
