import {
 Accordion,
 AccordionButton,
 AccordionIcon,
 AccordionItem,
 AccordionPanel,
 Box,
 BoxProps,
 CloseButton,
 Flex,
 Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { LinkItemProps } from "@/models/sidebar";

interface SidebarContentProps extends BoxProps {
 onClose: () => void;
 linkItems: LinkItemProps[];
}

const SidebarContent = ({
 onClose,
 linkItems,
 ...rest
}: SidebarContentProps) => {
 return (
  <Box
   bg="#fff"
   borderRight="1px"
   borderRightColor={"gray.700"}
   w={{ base: "full", md: 60 }}
   pos="fixed"
   h="full"
   {...rest}
  >
   <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
    <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
     Logo
    </Text>
    <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
   </Flex>
   <Accordion defaultIndex={[0]} allowMultiple>
    {linkItems.map((link: LinkItemProps) => (
     <AccordionItem key={link.name}>
      <h2>
       <AccordionButton>
        <Box as="span" flex="1" textAlign="left">
         {link.name}
        </Box>
        <AccordionIcon />
       </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
       {link.children.map((subLink) => (
        <Flex
         key={subLink.href}
         align="center"
         as={NextLink}
         href={subLink.href}
         p="4"
         mx="4"
         borderRadius="lg"
         textDecoration="none"
         role="group"
         cursor="pointer"
         _hover={{
          bg: "cyan.400",
          color: "white",
         }}
         {...rest}
        >
         {subLink.title}
        </Flex>
       ))}
      </AccordionPanel>
     </AccordionItem>
    ))}
   </Accordion>
  </Box>
 );
};
export default SidebarContent;
