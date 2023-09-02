import { FC, memo, useState } from 'react';
import { Box, Popover, PopoverContent, PopoverTrigger, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { SubLabel } from '@/models/header';

interface DesktopSubNav {
  label: string;
  subLabels: SubLabel[];
}
const DesktopSubNav: FC<DesktopSubNav> = ({ label, subLabels }) => {
  const [isChevronIconVisible, setIsChevronIconVisible] = useState(false);
  return (
    <Popover trigger="hover" id={`popover-trigger-menu_sub_navigation`} placement="right">
      <PopoverTrigger>
        <Box role={'group'} width="100%" display={'block'} rounded={'md'}>
          <Stack direction={'row'} align={'center'} width="100%">
            <Box display="flex" gap={11} flexDirection="column" width="100%">
              <Text
                fontWeight={700}
                width="100%"
                fontSize={16}
                marginBottom="5px"
                padding="8px 16px"
                margin={0}
                display="flex"
                justifyContent="space-between"
                as={Link}
                href=""
                _hover={{
                  bg: '#F6FCFF',
                }}
                onMouseLeave={() => setIsChevronIconVisible(false)}
                onMouseOver={() => setIsChevronIconVisible(true)}>
                {label}

                {isChevronIconVisible && (
                  <Image
                    width={16}
                    height={16}
                    alt="chevron_right"
                    src="/icons/chevron_right.svg"
                  />
                )}
              </Text>
            </Box>
          </Stack>
        </Box>
      </PopoverTrigger>

      <PopoverContent marginTop="25%">
        {subLabels.length
          ? subLabels.map(({ subLabelName }, index: number) => (
              <Box
                display="flex"
                gap={11}
                flexDirection="column"
                width="100%"
                key={index}
                rounded="md">
                <Text
                  as={Link}
                  href={''}
                  lineHeight="normal"
                  fontFamily="Segoe UI"
                  marginBottom="5px"
                  padding="8px 16px"
                  _hover={{ color: '#3CB3E5' }}
                  fontWeight={400}
                  fontSize={16}>
                  {subLabelName}
                </Text>
              </Box>
            ))
          : null}
      </PopoverContent>
    </Popover>
  );
};

export default memo(DesktopSubNav);
