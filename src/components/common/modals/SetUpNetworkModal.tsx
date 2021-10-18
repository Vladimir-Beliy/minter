import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, Button, ModalBody, ModalFooter, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
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

  const [faucetError, setFaucetError] = useState<string | null>(null);
  const [marketplaceError, setMarketplaceError] = useState<string | null>(null);

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

    if (!(faucetError || marketplaceError)) {
      window.localStorage.setItem('networkConfig', JSON.stringify(newConfig));
      window.location.reload();
      close();
    }
  }

  const onReset = () => {
    window.localStorage.setItem('networkConfig', JSON.stringify(config));
    window.location.reload();
    close();
  }

  const validate = (value: string, errorSetter: (value: string | null) => void) => {
    let error = null;

    if (!value) {
      error = 'value is required';
    } else if (/\W/g.test(value)) {
      error = 'value should contain only letters and numbers';
    } else if (!(value.slice(0, 3) === 'KT1')) {
      error = 'value must start with "KT1"';
    } else if (!(value.length === 36)) {
      error = 'value must contain 36 characters';
    }

    errorSetter(error);
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
            <FormControl paddingBottom={6} isRequired isInvalid={!!faucetError}>
              <FormLabel fontFamily="mono">NFT Faucet</FormLabel>

              <Input
                value={faucet}
                onChange={(e) => setFaucet(e.target.value)}
                onBlur={(e) => validate(e.target.value, setFaucetError)}
              />

              <FormErrorMessage>{faucetError}</FormErrorMessage>
            </FormControl>

            <FormControl paddingBottom={6} isRequired isInvalid={!!marketplaceError}>
              <FormLabel fontFamily="mono">Marketplace</FormLabel>

              <Input
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value)}
                onBlur={(e) => validate(e.target.value, setMarketplaceError)}
              />

              <FormErrorMessage>{marketplaceError}</FormErrorMessage>
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
