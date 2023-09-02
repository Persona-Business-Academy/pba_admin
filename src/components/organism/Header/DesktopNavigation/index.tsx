import React, { FC, memo } from 'react';
import { Box, Flex, Popover, PopoverContent, PopoverTrigger, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { NavItem, SubLabels } from '@/models/header';
import DesktopSubNav from '../DesktopSubNavigation';

type Props = {
  navItems: NavItem[];
};

const DesktopNav: FC<Props> = ({ navItems }) => {
  return (
    <Stack direction={'row'} justifyContent="center" alignItems="center" gap={40}>
      {navItems.map((navItem, index) => (
        <Box key={index}>
          <Popover trigger="hover" id="popover-trigger-menu">
            <PopoverTrigger>
              <Box
                {...(navItem.href ? { as: Link, href: navItem.href } : {})}
                cursor="pointer"
                fontSize={16}
                fontWeight={400}
                color="#222"
                _hover={{
                  textDecoration: 'none',
                  color: '#3CB4E7',
                }}>
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && !navItem.href && (
              <PopoverContent
                id={Date.now().toString()}
                border={0}
                boxShadow="0px 15px 20px 0px rgba(0, 0, 0, 0.05)"
                bg="#fff"
                borderRadius="0px 0px 12px 12px"
                width="100vw"
                height={490}>
                <Stack
                  width={1200}
                  paddingTop={48}
                  paddingBottom={40}
                  margin="0 auto"
                  gap={69}
                  flexDirection="row"
                  display="flex">
                  <Stack width="183px" gap="14px">
                    {navItem.children.map((child: SubLabels, index: number) => (
                      <DesktopSubNav key={index} {...child} />
                    ))}
                  </Stack>
                  <Stack
                    margin="0 auto"
                    display="grid"
                    gap={42}
                    gridTemplateColumns="repeat(5,156px)">
                    {navItem.featuredItems?.map(
                      (
                        { imgPath, categoryName }: { imgPath: any; categoryName: any },
                        i: number,
                      ) => (
                        <Flex as={Link} href="" key={i} flexDirection="column" gap={16}>
                          <Image src={imgPath} alt={categoryName} width={156} height={104} />
                          <Text fontSize={16} fontWeight={400} textAlign="center">
                            {categoryName}
                          </Text>
                        </Flex>
                      ),
                    )}
                  </Stack>
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

export default memo(DesktopNav);
