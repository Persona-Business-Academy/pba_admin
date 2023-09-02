import React, { FC, memo } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  data: Array<{ href: string; title: string }>;
  children: React.ReactNode;
}

const AuthBox: FC<Props> = ({ data, children }) => {
  const pathname = usePathname();

  return (
    <Box
      boxShadow={'0px 4px 8px 0px rgba(0, 0, 0, 0.10)'}
      background={'white'}
      borderRadius={12}
      padding={32}
      width={400}>
      <HStack spacing="20px" paddingBottom={32}>
        {data.map(({ href, title }) => (
          <Link
            key={href}
            as={NextLink}
            href={href}
            color="grey.300"
            fontSize={20}
            lineHeight="normal"
            _hover={{ textDecoration: 'none' }}
            fontWeight={pathname === href ? 600 : 400}
            fontStyle="normal">
            {title}
          </Link>
        ))}
      </HStack>
      {children}
    </Box>
  );
};

export default memo(AuthBox);
