"use client";
import React, { useCallback } from "react";
import {
 Box,
 Button,
 Flex,
 FormControl,
 FormLabel,
 Switch,
 useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "@/components/atom";
import { ERROR_MESSAGES } from "@/constants/common";
import { SignInFormData } from "@/models/auth";

function Signin() {
 const toast = useToast();
 const { push } = useRouter();

 const {
  control,
  handleSubmit,
  formState: { errors, isSubmitting },
 } = useForm<SignInFormData>({
  defaultValues: { email: "", password: "", rememberMe: false },
 });

 const onSubmit: SubmitHandler<SignInFormData> = useCallback(
  async ({ email, password }) => {
   try {
    const res = await signIn("credentials", {
     email,
     password,
     redirect: false,
    });
    console.log(res);
    if (res?.ok) {
     push("/dashboard");
    } else {
     toast({
      title: "Invalid credentials",
      description: ERROR_MESSAGES.invalidCredentials,
      status: "error",
     });
    }
   } catch {
    toast({
     title: ERROR_MESSAGES.somethingWentWrong,
     status: "error",
    });
   }
  },
  [push, toast]
 );

 return (
  <Flex
   direction="column"
   alignSelf="center"
   justifySelf="center"
   overflow="hidden"
  >
   <Box
    position="absolute"
    minH={{ base: "70vh", md: "100vh" }}
    w={{ md: "calc(100vw - 50px)" }}
    borderRadius={{ md: "15px" }}
    left="0"
    right="0"
    bgRepeat="no-repeat"
    overflow="hidden"
    zIndex="-1"
    top="0"
    bgImage="/images/basic-auth.png"
    bgSize="cover"
    mx={{ md: "auto" }}
    mt={{ md: "14px" }}
   ></Box>
   <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
    <Flex
     direction="column"
     w="445px"
     background="transparent"
     borderRadius="15px"
     p="40px"
     mx={{ base: "100px" }}
     bg="#fff"
     boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
    >
     <Controller
      name="email"
      control={control}
      rules={{
       required: "This field is required",
      }}
      render={({ field: { onChange, value } }) => (
       <FormInput
        isRequired
        isInvalid={!!errors.email?.message}
        name="email"
        type="email"
        formLabelName="Email"
        value={value}
        handleInputChange={onChange}
        formErrorMessage={errors.email?.message}
       />
      )}
     />

     <Controller
      name="password"
      control={control}
      rules={{
       required: "This field is required",
      }}
      render={({ field: { onChange, value } }) => (
       <FormInput
        isRequired
        isInvalid={!!errors.password?.message}
        name="password"
        formLabelName="Password"
        value={value}
        handleInputChange={onChange}
        type="password"
        formHelperText="Your password must be less than 6 characters."
        formErrorMessage={errors.password?.message}
       />
      )}
     />
     <FormControl display="flex" alignItems="center" mb="24px">
      <Switch id="remember-login" colorScheme="teal" me="10px" />
      <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal">
       Remember me
      </FormLabel>
     </FormControl>
     <Button
      type="submit"
      bg="teal.300"
      fontSize="sm"
      color="white"
      fontWeight="bold"
      w="100%"
      h="45"
      mb="24px"
      _hover={{
       bg: "teal.200",
      }}
      _active={{
       bg: "teal.400",
      }}
      isDisabled={isSubmitting}
      onClick={handleSubmit(onSubmit)}
     >
      SIGN IN
     </Button>
    </Flex>
   </Flex>
  </Flex>
 );
}

export default Signin;
