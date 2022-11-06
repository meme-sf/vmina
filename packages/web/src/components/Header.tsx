import React from 'react';
import { Box, Center, Button, Icon, Image } from '@chakra-ui/react';
import NextLink from 'next/link';
import { AiOutlinePlus } from 'react-icons/ai';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { shortenEOAName } from 'utils/shortenEOA';
import { BiWallet } from 'react-icons/bi'

const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const shortAddress = shortenEOAName(address);
  return (
    <>
      <Box w="100%" h="60px" p="0 30px 0 0" bg="#FFFDF6">
        <Center h="100%" justifyContent="space-between">
          <NextLink href="/" passHref>
            <Image alt="vmina logo" src="logo.png" h="60px" />
          </NextLink>
          <Box>
            <NextLink href="/upload" passHref>
              <Button mr="20px" colorScheme="orange">
                <Icon as={AiOutlinePlus} />
              </Button>
            </NextLink>
            {isConnected ? (
              <Button leftIcon={<BiWallet />} colorScheme="orange" onClick={() => disconnect()}>
                {shortAddress}
              </Button>
            ) : (
              <Button leftIcon={<BiWallet />} colorScheme="orange" onClick={() => connect()}>
                Connect Wallet
              </Button>
            )}
          </Box>
        </Center>
      </Box>
    </>
  );
};

export default Header
