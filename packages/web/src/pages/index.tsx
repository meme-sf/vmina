import { Video } from '.prisma/client';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { NextPage } from 'next';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import Card from 'components/Card';

import prisma from '../lib/prisma';

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

const Index: NextPage<Props> = ({ videos }: Props) => {
  const router = useRouter();
  if (!videos) return <>loading...</>;
  return (
    <>
      <SimpleGrid columns={3} spacing={20} w="100%" p="0 12%" mt="40px">
        {videos.map((val: Video, key: number) => {
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
