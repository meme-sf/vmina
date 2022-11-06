import { Box, Button, Center, Input, Image } from '@chakra-ui/react'
import React, { useState, useRef } from 'react'
import { NFTStorage, File } from 'nft.storage'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios'

const ImageTest = () => {
  const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || '' })
  const [pathnames, setPathnames] = useState<string[]>([])

  const sliderRef = useRef(null)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
  }

  const handleIPFS = async (file: any) => {
    const metadata = await client.store({
      name: 'Pinpie',
      description: 'Pin is not delicious beef!',
      image: new File(
        [
          file
        ],
        file.name,
        { type: file.type }
      ),
    })
    console.log(metadata.data.image.pathname);
    setPathnames((prevState) => [...prevState, metadata.data.image.pathname])
  }

  const handleUpload = async (e: any) => {
    console.log(e.target.files);
    [...e.target.files].map((val: any, key: any) => {
      handleIPFS(val)
    })
  }

  const handleSubmit = async () => {
    const data = {
      'imagePaths': pathnames,
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    }
    console.log(data)
    return new Promise((resolve, reject) => {
      axios.post('/api/postVideo', data, config)
      .then(response => {
        if(response.status !== 200) throw Error("Server error")
        resolve(response)
      })
      .catch(e => {
        reject(e);
        throw Error("Server error:" + e)
      })
    })
  }
  return (
    <>
      <Center mt='40px' mb='40px'>
        <Input type='file' multiple={true} onChange={(e) => {handleUpload(e)}} w='40%' />
      </Center>
      {pathnames.length !== 0 ? (
        <>
          <Slider ref={sliderRef} {...settings}>
            {pathnames.map((val: string, key: number) => {
              return (
                <Center key={key} w='100%'>
                  <Box boxSize='sm' m='0 auto'>
                    <Image src={`https://ipfs.io/ipfs${val}`} alt='image test' key={key} />
                  </Box>
                </Center>
              )
            })}
          </Slider>
          <Center mt='80px'>
            <Button w='30%' onClick={handleSubmit}>
              Upload
            </Button>
          </Center>
        </>
      ) : null}
    </>
  )
}

export default ImageTest
