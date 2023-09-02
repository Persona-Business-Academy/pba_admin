import React, { FC } from 'react';
import { Flex, Select, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { Button, FormInput } from '@/components/atom';

type Props = {};

const EditProfile: FC<Props> = () => {
  return (
    <Flex flexDirection="column" gap="40px">
      <Flex gap={16}>
        <Image
          width={101}
          height={101}
          alt="profile Image"
          src="/images/authenticated/profile.png"
        />
        <Flex flexDirection="column" justifyContent="center">
          <Text as="p" color="#222222" fontFamily="Segoe UI" fontSize={24} fontWeight={700}>
            Name Surname
          </Text>
          <Button
            bg="transparent"
            color="#1F1646"
            _hover={{
              bg: 'transparent',
            }}
            _focus={{
              bg: 'transparent',
            }}>
            Change photo
          </Button>
        </Flex>
      </Flex>

      <Flex flexDirection="column" gap={24}>
        <Flex gap={24}>
          <FormInput name="firstName" formLabelName="First Name" />
          <FormInput name="lastName" formLabelName="Last Name" />
        </Flex>
        <Flex gap={24}>
          <FormInput name="email" formLabelName="Email" isRequired />
          <FormInput name="phoneNumber" formLabelName="phoneNumber" />
        </Flex>
        <Flex>
          <FormInput name="phoneNumber" formLabelName="Address" isRequired />
        </Flex>
        <Flex>
          <Select></Select>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default EditProfile;
