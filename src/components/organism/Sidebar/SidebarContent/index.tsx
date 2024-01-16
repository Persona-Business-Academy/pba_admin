import { memo, useMemo } from "react";
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
} from "@chakra-ui/react";
import NextLink from "next/link";
import Logo from "/public/icons/persona_logo.svg";
import { usePathname } from "next/navigation";
import { LinkItemProps } from "@/utils/models/sidebar";

interface SidebarContentProps extends BoxProps {
  onClose: () => void;
  linkItems: LinkItemProps[];
}

const SidebarContent = ({ onClose, linkItems, ...rest }: SidebarContentProps) => {
  const pathname = usePathname();

  const defaultIndex = useMemo(() => {
    let idx = 0;
    console.log(linkItems);

    linkItems.some((item, index) => {
      const isExist = item.children.some(el => pathname === el.href);
      if (isExist) {
        idx = index;
        return true;
      }
      return false;
    });
    return [idx];
  }, [linkItems, pathname]);

  return (
    <Box
      bg="#fff"
      borderRight="1px"
      borderRightColor={"gray.200"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="100%"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Accordion defaultIndex={defaultIndex} allowMultiple>
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
              {link.children.map(subLink => (
                <Flex
                  key={subLink.href}
                  align="center"
                  onClick={onClose}
                  as={NextLink}
                  href={subLink.href}
                  p="4"
                  borderRadius="lg"
                  textDecoration="none"
                  role="group"
                  cursor="pointer"
                  bg={pathname === subLink.href ? "cyan.400" : "unset"}
                  color={pathname === subLink.href ? "white" : "unset"}
                  _hover={
                    pathname !== subLink.href
                      ? {
                          bg: "cyan.300",
                          color: "white",
                        }
                      : {}
                  }
                  {...rest}>
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
export default memo(SidebarContent);
