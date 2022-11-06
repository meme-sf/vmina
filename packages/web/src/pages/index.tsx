import { NextPage } from 'next';
import React, { useRef } from 'react'
import type { GetServerSideProps } from "next";
import prisma from '../lib/prisma'
import { Video } from '.prisma/client';
import { Box, Button, Center, Input, Image } from '@chakra-ui/react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Props = {
  videos: Video[]
}
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const videosRaw = await prisma.video.findMany()
  const videos = JSON.parse(JSON.stringify(videosRaw))
  return {
    props: {
      videos,
    },
  };
}
interface PropTypes {
  videos: Video[]
}

const Index: NextPage<PropTypes> = ({ videos }) => {
  const sliderRef = useRef(null)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
  }

  if(!videos) return (
    <>loading...</>
  )
  return (
    <>
      {videos.map((val: Video, key: number) => {
        return (
          <>
            <Slider ref={sliderRef} {...settings} key={key}>
              {val.imagePaths.map((val: string, key: number) => {
                return (
                  <Center key={key} w='100%'>
                    <Box boxSize='sm' m='0 auto'>
                      <Image src={`https://ipfs.io/ipfs${val}`} alt='image test' key={key} />
                    </Box>
                  </Center>
                )
              })}
            </Slider>
          </>
        )
      })}
    </>
  );
}

export default Index
