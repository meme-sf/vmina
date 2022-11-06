import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import React, { useRef, useState } from 'react';
import axios from 'axios'

import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react';
import { Video } from '@prisma/client';
import { NextPage } from 'next';
import type { GetServerSideProps } from 'next';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { FiExternalLink } from 'react-icons/fi';
import Slider from 'react-slick';
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import prisma from '../lib/prisma';
import CircleLoader from 'react-spinners/CircleLoader';

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  //@ts-ignore
  const id = JSON.parse(context.query.id);
  const videoRaw = await prisma.video.findUnique({
    where: {
      id: id,
    },
  });
  const video = JSON.parse(JSON.stringify(videoRaw));
  return {
    props: {
      video,
    },
  };
};

type Props = {
  video: Video;
};

const VideoPage: NextPage<Props> = ({ video }: Props) => {
  const sliderRef = useRef(null);
  const finalRef = useRef(null)
  const router = useRouter()
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState<boolean>(false)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
  };

  const handleSubmit = async () => {
    if(!isConnected) return
    setLoading(true)
    const data = {
      address: address,
      imagePaths: video.imagePaths[0],
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log(data);
    return new Promise((resolve, reject) => {
      axios
        .post('/api/mintNFT', data, config)
        .then((response) => {
          if (response.status !== 200) throw Error('Server error');
          router.push('/');
          setLoading(false)
          resolve(response);
        })
        .catch((e) => {
          reject(e);
          throw Error('Server error:' + e);
        });
    });
  }

  const handleOptSubmit = async () => {
    if(!isConnected) return
    setLoading(true)
    const data = {
      address: address,
      imagePaths: video.imagePaths[0],
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log(data);
    return new Promise((resolve, reject) => {
      axios
        .post('/api/mintOptNFT', data, config)
        .then((response) => {
          if (response.status !== 200) throw Error('Server error');
          router.push('/');
          setLoading(false)
          resolve(response);
        })
        .catch((e) => {
          reject(e);
          throw Error('Server error:' + e);
        });
    });
  }

  if (!video) return <>loading...</>;
  return (
    <>
      <Box p="0 10%" ref={finalRef}>
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
            h="400px"
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
                  Minting your Vmina NFT for your
                  <br />
                  Exclusive video access.
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
        <Box bg="white" mt="20px" borderRadius="20px" h="85vh">
          <Slider ref={sliderRef} {...settings}>
            {video.imagePaths.map((val: string, key: number) => {
              return (
                <Center key={key} w="100%">
                  <Image
                    src={`https://ipfs.io/ipfs${val}`}
                    alt="image test"
                    w="60%"
                    m="0 auto"
                    maxH="500px"
                  />
                </Center>
              );
            })}
          </Slider>
          <Box w="100%">
            <Flex
              color="black"
              m="40px 40px 20px 40px"
              justifyContent="space-between"
            >
              <Center
                textAlign="left"
                fontSize="30px"
                fontWeight="bold"
                color="black"
              >
                {video.title}
                <Icon
                  opacity={video.isVerified ? 1 : 0}
                  color="#1C9BEF"
                  ml="20px"
                  as={BsFillPatchCheckFill}
                />
              </Center>
              <Box fontWeight="bold">
                <Center as={Link} target="_blank" href={`/${video.txHash}`}>
                  txHash: {video.txHash}
                  <Icon ml="5px" as={FiExternalLink} />
                </Center>
                <Flex
                  lineHeight="17px"
                  as={Link}
                  target="_blank"
                  href={`/${video.ownerAddress}`}
                >
                  Owner: {video.ownerAddress}
                  <Icon ml="5px" as={FiExternalLink} />
                </Flex>
              </Box>
            </Flex>
            <Flex>
              <Text
                textAlign="left"
                fontSize="20px"
                fontWeight="bold"
                color="black"
                m="0 40px"
              >
                {video.details}
              </Text>
              <Box textAlign="right" p="10px 40px">
                <Text color="black" fontWeight="bold" fontSize="20px">
                  ${video.price}
                </Text>
                <Button color="black" colorScheme="orange" w="150px" onClick={handleSubmit}>
                  Buy
                </Button>
                <Button mt='10px' color="black" colorScheme="orange" w="150px" onClick={handleOptSubmit}>
                  Buy w/ Opt
                </Button>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default VideoPage;
