import { Box, Button, Center, Input, Image, Textarea } from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import { NFTStorage, File } from 'nft.storage';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import { useRouter } from 'next/router';

const Upload = () => {
  const router = useRouter();
  const client = new NFTStorage({
    token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || '',
  });
  const [pathnames, setPathnames] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [details, setDetails] = useState<string>('');

  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
  };

  const handleIPFS = async (file: any) => {
    const metadata = await client.store({
      name: 'Pinpie',
      description: 'Pin is not delicious beef!',
      image: new File([file], file.name, { type: file.type }),
    });
    console.log(metadata.data.image.pathname);
    setPathnames((prevState) => [...prevState, metadata.data.image.pathname]);
  };

  const handleUpload = async (e: any) => {
    console.log(e.target.files);
    [...e.target.files].map((val: any, key: any) => {
      handleIPFS(val);
    });
  };

  const handleSubmit = async () => {
    const data = {
      imagePaths: pathnames,
      title: title,
      price: price,
      details: details,
      txHash: '0x1fe99c8e68d92f484cf3d78cb3e5e684e6278df72ae9a1ec22b813bc5e08bcfa',
      ownerAddress: '0x3f7E10eD4eac8c4a9c54ffbcD632215Aa78D598E',
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log(data);
    return new Promise((resolve, reject) => {
      axios
        .post('/api/postVideo', data, config)
        .then((response) => {
          if (response.status !== 200) throw Error('Server error');
          router.push('/');
          resolve(response);
        })
        .catch((e) => {
          reject(e);
          throw Error('Server error:' + e);
        });
    });
  };
  return (
    <>
      <Center mt="40px" mb="40px">
        <Input
          type="file"
          multiple={true}
          onChange={(e) => {
            handleUpload(e);
          }}
          w="40%"
        />
      </Center>
      {pathnames.length !== 0 ? (
        <>
          <Slider ref={sliderRef} {...settings}>
            {pathnames.map((val: string, key: number) => {
              return (
                <Center key={key} w="100%">
                  <Box boxSize="sm" m="0 auto">
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
          <Center mt="80px" p="0 20%" gap={5}>
            Title:
            <Input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            Price:
            <Input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </Center>
          <Center mt="40px" p="0 20%" gap={5}>
            Details:
            <Textarea
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
              }}
            />
          </Center>
          <Center mt="40px">
            <Button w="30%" onClick={handleSubmit} mb="40px">
              Upload
            </Button>
          </Center>
        </>
      ) : null}
    </>
  );
};

export default Upload
