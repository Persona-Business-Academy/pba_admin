import React, { FC, memo } from 'react';
import { Box, Container, Flex, Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {};

const Footer: FC<Props> = () => {
  return (
    <Stack bg="#FFF9F8" height={778}>
      <Container maxWidth={1200} margin="0 auto" padding={0}>
        <Grid
          templateColumns="repeat(auto-fit,minmax(127.3px, 1fr))"
          columnGap={70}
          rowGap={127}
          marginTop={66}
          mb={96}>
          <GridItem>
            <Flex flexDirection="column" gap="15px">
              <Text color="#222"> Our Expertise </Text>
              <Text as={Link} href="" color="#5B5B5B">
                For kids
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                For individuals
              </Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex flexDirection="column" gap="15px">
              <Text color="#222"> Information </Text>
              <Text as={Link} href="" color="#5B5B5B">
                FAQ
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Blog
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Support
              </Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex flexDirection="column" gap="15px">
              <Text color="#222">Company</Text>
              <Text as={Link} href="" color="#5B5B5B">
                About us
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Careers
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Contact us
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                PBA leadership
              </Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex flexDirection="column" gap="15px">
              <Text color="#222">Need some help?</Text>
              <Text as={Link} href="" color="#5B5B5B">
                Help Centre
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Contact
              </Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex flexDirection="column" gap="15px">
              <Text color="#222">Need some help?</Text>
              <Text as={Link} href="" color="#5B5B5B">
                Help Centre
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Contact
              </Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex flexDirection="column" gap="15px">
              <Text color="#222">Social Channels</Text>
              <Flex gap={16}>
                <a href="#" target="blank">
                  <Image src="/icons/facebook_icon.svg" width={32} height={32} alt="facebook" />
                </a>
                <a href="#" target="blank">
                  <Image src="/icons/instagram_icon.svg" width={32} height={32} alt="instagram" />
                </a>
                <a href="#" target="blank">
                  <Image src="/icons/linkedin_icon.svg" width={32} height={32} alt="instagram" />
                </a>
              </Flex>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex flexDirection="column" gap="15px">
              <Text color="#222"> Our Expertise </Text>
              <Text as={Link} href="" color="#5B5B5B">
                For kids
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                For individuals
              </Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex flexDirection="column" gap="15px">
              <Text color="#222"> Information </Text>
              <Text as={Link} href="" color="#5B5B5B">
                FAQ
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Blog
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Support
              </Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex flexDirection="column" gap="15px">
              <Text color="#222">Company</Text>
              <Text as={Link} href="" color="#5B5B5B">
                About us
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Careers
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Contact us
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                PBA leadership
              </Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex flexDirection="column" gap="15px">
              <Text color="#222">Information</Text>
              <Text as={Link} href="" color="#5B5B5B">
                Terms
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Privacy
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Cookies
              </Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex flexDirection="column" gap="15px">
              <Text color="#222">Information</Text>
              <Text as={Link} href="" color="#5B5B5B">
                Terms
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Privacy
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Cookies
              </Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex flexDirection="column" gap="15px">
              <Text color="#222">Information</Text>
              <Text as={Link} href="" color="#5B5B5B">
                Terms
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Privacy
              </Text>
              <Text as={Link} href="" color="#5B5B5B">
                Cookies
              </Text>
            </Flex>
          </GridItem>
        </Grid>
        <Flex justifyContent="space-between" pt={40}>
          <Box>
            <Text>© Persona, Inc. 2022. All rights reserved.</Text>
          </Box>
          <Box>
            <Text>
              <Image
                src="/icons/persona_logo.svg"
                width={135}
                height={27}
                alt="persona_grey_logo"
              />
            </Text>
          </Box>
          <Box>
            <Flex gap={8}>
              <Text>Terms & Conditions</Text>
              <Text>|</Text>
              <Text>Privacy</Text>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Stack>
  );
};

export default memo(Footer);
