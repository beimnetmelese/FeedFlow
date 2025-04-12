import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Card,
  CardBody,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://Bewnet.pythonanywhere.com/auth/jwt/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Store tokens in cache
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
      }

      // Redirect to admin dashboard
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      toast({
        title: "Login Error",
        description:
          error instanceof Error ? error.message : "Invalid credentials",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, gray.50, teal.50)"
      p={4}
    >
      <Card
        w="100%"
        maxW="md"
        boxShadow="xl"
        borderRadius="2xl"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.100"
        bg="white"
      >
        <CardBody p={10}>
          <Flex direction="column" align="center" mb={10}>
            <Box
              bg="teal.500"
              p={4}
              borderRadius="full"
              mb={6}
              boxShadow="0 4px 12px rgba(66, 153, 225, 0.3)"
            >
              <FiLock size={32} color="white" />
            </Box>
            <Heading as="h1" size="xl" color="gray.800" textAlign="center">
              Admin Portal
            </Heading>
            <Text color="gray.500" mt={2}>
              Secure system access
            </Text>
          </Flex>

          <form onSubmit={handleLogin}>
            <FormControl mb={6} isRequired>
              <FormLabel color="gray.700">Username</FormLabel>
              <InputGroup>
                <Input
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Username"
                  size="lg"
                  color={"black"}
                  borderRadius="xl"
                  borderColor="gray.200"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "teal.500",
                    boxShadow: "0 0 0 1px teal.500",
                  }}
                  pl={12}
                />
                <Box
                  color={"black"}
                  position="absolute"
                  left={4}
                  top="50%"
                  transform="translateY(-50%)"
                >
                  <FiMail color="gray.400" />
                </Box>
              </InputGroup>
            </FormControl>

            <FormControl mb={8} isRequired>
              <FormLabel color="gray.700">Password</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  color={"black"}
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  size="lg"
                  borderRadius="xl"
                  borderColor="gray.200"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "teal.500",
                    boxShadow: "0 0 0 1px teal.500",
                  }}
                  pl={12}
                />
                <Box
                  color={"black"}
                  position="absolute"
                  left={4}
                  top="50%"
                  transform="translateY(-50%)"
                >
                  <FiLock color="gray.400" />
                </Box>
                <InputRightElement h="full">
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    color={"black"}
                    icon={showPassword ? <FiEyeOff /> : <FiEye />}
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    _hover={{ bg: "transparent" }}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              width="full"
              borderRadius="xl"
              height="50px"
              isLoading={isLoading}
              loadingText="Authenticating..."
              spinner={<Spinner size="sm" />}
              bgGradient="linear(to-r, teal.500, teal.600)"
              _hover={{
                bgGradient: "linear(to-r, teal.600, teal.700)",
                transform: "translateY(-2px)",
                boxShadow: "md",
              }}
              _active={{
                transform: "translateY(0)",
              }}
              transition="all 0.2s"
            >
              Access Dashboard
            </Button>
          </form>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default AdminLogin;
