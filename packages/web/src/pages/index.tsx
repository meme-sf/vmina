import { NextPage } from 'next';
import React from 'react'
import type { GetServerSideProps } from "next";
import prisma from '../lib/prisma';
import { Box, SimpleGrid } from '@chakra-ui/react';
import Card from 'components/Card';
import { useRouter } from 'next/router';

type Props = {
  videos: any[];
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
  videos: any[];
}

const Index: NextPage<PropTypes> = ({ videos }) => {
  const router = useRouter()
  if(!videos) return (
    <>loading...</>
  )
  return (
    <>
      <SimpleGrid columns={3} spacing={20} w="100%" p="0 12%" mt="40px">
        {videos.map((val: any, key: number) => {
          return (
            <Box
              key={key}
              onClick={() => {
                router.push(`/video?id=${val.id}`);
              }}
            >
              <Card video={val} key={key} />
            </Box>
          );
        })}
      </SimpleGrid>
    </>
  );
};

export default Index;
