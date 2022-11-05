import React from 'react'
import NextLink from 'next/link'
import { Box, Text, Center, Button } from '@chakra-ui/react'

const Header: React.FC = () => {
  return (
    <>
      <Box w='100%' h='60px' p='0 30px'>
        <Center h='100%' justifyContent={'space-between'}>
          <NextLink href='/' passHref>
            <Text>
              Vmina
            </Text>
          </NextLink>
          <Button>
            {/* Wallet Connect */}
            Connect Wallet
          </Button>
        </Center>
      </Box>
    </>
  )
}

export default Header
