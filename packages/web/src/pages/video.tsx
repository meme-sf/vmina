import { Video } from '.prisma/client'
import { NextPage } from 'next'
import prisma from '../lib/prisma'
import type { GetServerSideProps } from "next";
import React, { useState, useRef } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Button, Center, Text, Image, Flex, Icon, Link } from '@chakra-ui/react'
import { BsFillPatchCheckFill } from 'react-icons/bs'
import { FiExternalLink } from 'react-icons/fi'

type Props = {
  video: Video
}
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  //@ts-ignore
  const id = JSON.parse(context.query.id)
  const videoRaw = await prisma.video.findUnique({
    where: {
      id: id,
    },
  })
  const video = JSON.parse(JSON.stringify(videoRaw))
  return {
    props: {
      video,
    },
  };
}
interface PropTypes {
  video: Video
}

const Video: NextPage<PropTypes> = ({ video }) => {
  const sliderRef = useRef(null)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
  }

  if(!video) return (
    <>loading...</>
  )
  return (
    <>
      <Box p='0 10%'>
        <Box bg='white' mt='20px' borderRadius='20px' h='85vh'>
          <Slider ref={sliderRef} {...settings}>
            {video.imagePaths.map((val: string, key: number) => {
              return (
                <Center key={key} w='100%'>
                  <Image src={`https://ipfs.io/ipfs${val}`} alt='image test' w='60%' m='0 auto' maxH='500px' />
                </Center>
              )
            })}
          </Slider>
          <Box w='100%'>
            <Flex color='black' m='40px 40px 20px 40px' justifyContent='space-between'>
              <Center textAlign='left' fontSize='30px' fontWeight='bold' color='black' >
                {video.title}
                <Icon color='#1C9BEF' ml='20px' as={BsFillPatchCheckFill} />
              </Center>
              <Box fontWeight='bold'>
                <Center as={Link} target="_blank" href={'/0xfeofoda0398yf3983927ey298dvuhfuhdsig98e3r9h'}>
                  Owner: {video.txHash ? video.txHash : '0xfeofoda0398yf3983927ey298dvuhfuhdsig98e3r9h'}
                  <Icon ml='5px' as={FiExternalLink} />
                </Center>
                <Center as={Link} target="_blank" href={'/0xfeofoda0398yf3983927ey298dvuhfuhdsig98e3r9h'}>
                  txHash: {video.txHash ? video.txHash : '0xfeofoda0398yf3983927ey298dvuhfuhdsig98e3r9h'}
                  <Icon ml='5px' as={FiExternalLink} />
                </Center>
              </Box>
            </Flex>
            <Text textAlign='left' fontSize='20px' fontWeight='bold' color='black' m='0 40px'>
              {video.details}
            </Text>
            <Box textAlign='right' p='10px 40px'>
              <Text color='black' fontWeight='bold' fontSize='20px'>
                ${video.price}
              </Text>
              <Button color='black' colorScheme='orange' w='20%'>
                Buy
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Video