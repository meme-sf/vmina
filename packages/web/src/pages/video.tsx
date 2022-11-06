import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import React, { useRef } from 'react';

import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';
import { Video } from '@prisma/client';
import { NextPage } from 'next';
import type { GetServerSideProps } from 'next';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { FiExternalLink } from 'react-icons/fi';
import Slider from 'react-slick';

import prisma from '../lib/prisma';

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
  };

  if (!video) return <>loading...</>;
  return (
    <>
      <Box p="0 10%">
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
                <Button color="black" colorScheme="orange" w="150px">
                  Buy
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
