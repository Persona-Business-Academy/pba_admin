"use client";
import React, { useCallback } from "react";
import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "@/components/atom";
import { ERROR_MESSAGES } from "@/constants/common";
import { DASHBOARD_ROUTE } from "@/constants/routes";
import { SignInFormData } from "@/models/auth";

function Signin() {
 const toast = useToast();
 const { push } = useRouter();

 const {
  control,
  handleSubmit,
  formState: { errors, isSubmitting },
 } = useForm<SignInFormData>({
  defaultValues: { email: "", password: "" },
 });

 const onSubmit: SubmitHandler<SignInFormData> = useCallback(
  ({ email, password }) => {
   signIn("credentials", {
    email,
    password,
    redirect: false,
   })
    .then((res) => {
     if (res?.ok) {
      push(DASHBOARD_ROUTE);
     } else {
      toast({
       title: "Invalid credentials",
       description: ERROR_MESSAGES.invalidCredentials,
       status: "error",
      });
     }
    })
    .catch(() => {
     toast({
      title: ERROR_MESSAGES.somethingWentWrong,
      status: "error",
     });
    });
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
    minH={{ base: "70vh", md: "100vh" }}
    borderRadius={{ md: "15px" }}
    bg="#dedede"
   >
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
      <Button
       type="submit"
       bg="#3CB4E7"
       fontSize="sm"
       color="white"
       fontWeight="bold"
       w="100%"
       h="45"
       my="24px"
       isDisabled={isSubmitting}
       onClick={handleSubmit(onSubmit)}
      >
       SIGN IN
      </Button>
     </Flex>
    </Flex>
   </Box>
  </Flex>
 );
}

export default Signin;
