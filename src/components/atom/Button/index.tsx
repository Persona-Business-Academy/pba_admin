import React, { FC, memo, ReactNode } from "react";
import { ButtonProps, Button as ChakraButton } from "@chakra-ui/react";

interface SharedButtonProps extends ButtonProps {
 children: ReactNode;
}

const Button: FC<SharedButtonProps> = ({ children, ...props }) => {
 return (
  <ChakraButton
   color="#FFFFFF"
   _focus={{
    bg: "blue.500",
    color: "#FFFFFF",
   }}
   _focusVisible={{
    bg: "blue.500",
    color: "#FFFFFF",
   }}
   _disabled={{
    bg: "grey.50",
    color: "grey.200",
    cursor: "not-allowed",
   }}
   bg="teal.300"
   _hover={{
    bg: "teal.200",
   }}
   _active={{
    bg: "teal.400",
   }}
   {...props}
  >
   {children}
  </ChakraButton>
 );
};

export default memo(Button);
