import { Video } from '.prisma/client';
import React, { useRef } from 'react';
import { Box, Button, Center, Text, Image, Icon } from '@chakra-ui/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BsFillPatchCheckFill } from 'react-icons/bs';

interface Props {
  video: Video;
}

const Card: React.FC<Props> = ({ video }) => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
  };

  return (
    <>
      <Box w="100%" h="320px" bg="white" borderRadius="10px" overflow="hidden">
        <Slider ref={sliderRef} {...settings}>
          {video.imagePaths.map((val: string, key: number) => {
            return (
              <Center key={key} w="100%">
                <Image
                  src={`https://ipfs.io/ipfs${val}`}
                  alt="image test"
                  key={key}
                  w="100%"
                  height="200px"
                  m="0 auto"
                />
              </Center>
            );
          })}
        </Slider>
        <Center
          color="black"
          justifyContent={'space-between'}
          p="0 20px"
          mt="30px"
          fontSize="18px"
          fontWeight="bold"
        >
          <Center gap={1}>
            {video.title ? video.title : 'No title'}
            <Icon opacity={video.isVerified ? 1 : 0} color="#1C9BEF" as={BsFillPatchCheckFill} />
          </Center>
          <Text>{video.price ? `$ ${video.price}` : 'No price'}</Text>
        </Center>
        <Box textAlign="right" p="10px 20px">
          <Button color="black" colorScheme="orange">
            Buy
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Card;
