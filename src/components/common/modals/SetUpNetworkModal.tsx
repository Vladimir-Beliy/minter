import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, Box, Button, ModalBody, ModalFooter, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useSelector } from '../../../reducer';
import config from '../../../config.json';
import { Config } from '../../../lib/system';

interface Props {
  isOpen: boolean,
  close: () => void,
}

export const SetUpNetworkModal: FC<Props> = (props) => {
  const {
    isOpen,
    close,
  } = props;

  const globalConfig = useSelector(s => s.system.config);

  const [faucet, setFaucet] = useState(globalConfig.contracts.nftFaucet);
  const [marketplace, setMarketplace] = useState(globalConfig.contracts.marketplace.fixedPrice.tez);

  const onSubmit = () => {
    const newConfig: Config = {
      ...config,
      contracts: {
        nftFaucet: faucet,
        marketplace: {
          fixedPrice: {
            tez: marketplace,
          },
        }
      }
    }

    window.localStorage.setItem('networkConfig', JSON.stringify(newConfig));
    window.location.reload();
    close();
  }

  const onReset = () => {
    window.localStorage.setItem('networkConfig', JSON.stringify(config));
    window.location.reload();
    close();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      closeOnEsc
      closeOnOverlayClick
    >
      <ModalOverlay />
      <ModalContent mt={40}>
        <ModalHeader>Set Up Network</ModalHeader>

        <ModalCloseButton />

        <form onSubmit={(e) => {
          e.preventDefault();

          onSubmit();
        }}>
          <ModalBody>
            <FormControl paddingBottom={6} isRequired>
              <FormLabel fontFamily="mono">NFT Faucet</FormLabel>

              <Input
                value={faucet}
                onChange={(e) => setFaucet(e.target.value)}
              />
            </FormControl>

            <FormControl paddingBottom={6} isRequired>
              <FormLabel fontFamily="mono">Marketplace</FormLabel>

              <Input
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              mr="8px"
              variant="primaryAction"
              isFullWidth={true}
              type="submit"
            >
              Update Config
            </Button>

            <Button
              ml="8px"
              variant="primaryAction"
              onClick={onReset}
              isFullWidth={true}
            >
              Reset Config
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
