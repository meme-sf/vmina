import React, { useState, useRef } from 'react';
import {
  Badge,
  Box,
  Button,
  Center,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Icon,
  Image,
} from '@chakra-ui/react';
import CircleLoader from 'react-spinners/CircleLoader';
import { AiOutlinePlus, AiOutlineArrowDown } from 'react-icons/ai';

type Props = {
  setStep: Function;
  pathnames: string[];
  b64: string | undefined;
};

const Verify: React.FC<Props> = ({ setStep, pathnames, b64 }) => {
  const finalRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(setLoading, 5000, false);
    setTimeout(setStep, 5000, 3);
  };
  return (
    <>
      <Box ref={finalRef}>
        <Modal
          finalFocusRef={finalRef}
          isOpen={loading}
          onClose={() => {
            setLoading(false);
          }}
        >
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent
            bg="white"
            w="90%"
            h="400px"
            borderRadius="20px"
            top="100px"
          >
            <ModalBody paddingInline="0">
              <Box mt="20px">
                <Text
                  color="black"
                  textAlign="center"
                  fontWeight="bold"
                  fontSize="25px"
                >
                  Verifing your Proof on Mina...
                  <br />
                  This might take time.
                </Text>
                <Center w="100%" mt="40px" mb="40px">
                  <CircleLoader
                    color="#EE6C4D"
                    loading={loading}
                    size={80}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </Center>
                <Center>
                  <Button
                    mt="50px"
                    color="black"
                    bg="white"
                    border="1px solid black"
                    borderRadius="30px"
                    w="90%"
                    h="60px"
                    fontSize="xl"
                    mb="30px"
                    onClick={() => {
                      setLoading(false);
                    }}
                  >
                    Close
                  </Button>
                </Center>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
        <Center justifyContent="space-between" p="0 20px">
          <Box w="40%">
            <Image
              src={`https://ipfs.io/ipfs${pathnames[0]}`}
              alt="image test"
            />
          </Box>
          <Icon w="70px" h="70px" as={AiOutlinePlus} />
          <Box w="40%">
            <video id="video" ref={videoRef} src={b64} controls />
          </Box>
        </Center>
        <Center>
          <Icon w="70px" h="70px" mt="50px" as={AiOutlineArrowDown} />
        </Center>
        <Center mt="50px">
          <Button
            fontSize="2xl"
            p="30px"
            colorScheme="orange"
            onClick={handleSubmit}
          >
            <Image
              mr="10px"
              h="40px"
              src="minaIcon2.png"
              alt="mina"
              borderRadius="5px"
            />
            Verify Proof on Mina
          </Button>
        </Center>
      </Box>
    </>
  );
};

export default Verify;
