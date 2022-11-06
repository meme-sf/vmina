import React from 'react';
import NextLink from 'next/link';
import { Box, Text, Center, Button, Icon, Image } from '@chakra-ui/react';
import { AiOutlinePlus } from 'react-icons/ai';

const Header: React.FC = () => {
  return (
    <>
      <Box w="100%" h="60px" p="0 30px 0 0" bg="#FFFDF6">
        <Center h="100%" justifyContent={'space-between'}>
          <NextLink href="/" passHref>
            <Image src="logo.png" h="60px" />
          </NextLink>
          <Box>
            <NextLink href="/upload" passHref>
              <Button mr="20px" colorScheme="orange">
                <Icon as={AiOutlinePlus} />
              </Button>
            </NextLink>
            <Button colorScheme="orange">
              {/* Wallet Connect */}
              Connect Wallet
            </Button>
          </Box>
        </Center>
      </Box>
    </>
  );
};

export default Header;
