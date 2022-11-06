import { NextPage } from 'next';
import React, { useRef } from 'react';
import type { GetServerSideProps } from 'next';
import prisma from '../lib/prisma';
import { Video } from '.prisma/client';
import {
  Box,
  Button,
  Center,
  Input,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import Card from 'components/Card';

type Props = {
  videos: Video[];
};
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const videosRaw = await prisma.video.findMany();
  const videos = JSON.parse(JSON.stringify(videosRaw));
  return {
    props: {
      videos,
    },
  };
};
interface PropTypes {
  videos: Video[];
}

const Index: NextPage<PropTypes> = ({ videos }) => {
  if (!videos) return <>loading...</>;
  return (
    <>
      <SimpleGrid columns={3} spacing={20} w="100%" p="0 12%" mt="40px">
        {videos.map((val: Video, key: number) => {
          return <Card video={val} key={key} />;
        })}
      </SimpleGrid>
    </>
  );
};

export default Index;
