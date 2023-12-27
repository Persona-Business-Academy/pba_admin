"use client";
import React, { useCallback, useEffect } from "react";
import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "@/components/atom";
import { ERROR_MESSAGES } from "@/utils/constants/common";
import { DASHBOARD_ROUTE } from "@/utils/constants/routes";
import { SignInFormData } from "@/utils/models/auth";

function Signin() {
  const toast = useToast();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<SignInFormData>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<SignInFormData> = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      try {
        const res = await signIn("credentials", {
          email,
          password,
          callbackUrl: DASHBOARD_ROUTE,
          redirect: false,
        });

        if (res?.ok && res.url) {
          router.push(res.url);
          router.refresh();
        } else {
          setError("root", { message: ERROR_MESSAGES.invalidCredentials });
        }
      } catch (error) {
        setError("root", { message: ERROR_MESSAGES.invalidCredentials });
      }
    },
    [router, setError],
  );

  useEffect(() => {
    if (errors.root && errors.root.message) {
      toast({ title: errors.root.message, status: "error" });
    }
  }, [errors.root, toast]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit(onSubmit)();
      }
    },
    [handleSubmit, onSubmit],
  );

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden">
      <Box minH={{ base: "70vh", md: "100vh" }} borderRadius={{ md: "15px" }} bg="#dedede">
        <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
          <Flex
            direction="column"
            w="445px"
            background="transparent"
            borderRadius="15px"
            p="40px"
            mx={{ base: "100px" }}
            bg="#fff"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)">
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
              isLoading={isSubmitting || isSubmitSuccessful}
              onClick={handleSubmit(onSubmit)}>
              SIGN IN
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}

export default Signin;
