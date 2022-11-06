import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Box, Button, Center, Input, Image, Textarea } from '@chakra-ui/react';

type Props = {
  pathnames: string[];
};
const Confirm: React.FC<Props> = ({ pathnames }) => {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [details, setDetails] = useState<string>('');

  const handleSubmit = async () => {
    const data = {
      imagePaths: pathnames,
      title: title,
      price: price,
      details: details,
      txHash:
        '0x1fe99c8e68d92f484cf3d78cb3e5e684e6278df72ae9a1ec22b813bc5e08bcfa',
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
          Confirm
        </Button>
      </Center>
    </>
  );
};

export default Confirm;
