import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  FormControl,
  Input,
  Textarea,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Card,
  CardBody,
  Icon,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import {
  FiSend,
  FiCheckCircle,
  FiHelpCircle,
  FiMessageSquare,
} from "react-icons/fi";

const FAQTrainer = () => {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/faq/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Training failed");
      onOpen();
      setFormData({ question: "", answer: "" });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to train the AI",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <Card
        bg="white"
        boxShadow="0 10px 30px -5px rgba(0, 0, 0, 0.1)"
        borderRadius="2xl"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.100"
      >
        <CardBody p={10}>
          <Flex direction="column" align="center" mb={10}>
            <Icon as={FiHelpCircle} boxSize={10} color="teal.500" mb={4} />
            <Heading as="h2" size="xl" color="gray.800" textAlign="center">
              Teach Our AI
            </Heading>
            <Text color="gray.500" mt={2} textAlign="center">
              Add new questions and answers to improve our assistant
            </Text>
          </Flex>

          <form onSubmit={handleSubmit}>
            <FormControl mb={8} position="relative">
              <InputGroup>
                <InputLeftElement pointerEvents="none" h="full">
                  <Icon as={FiMessageSquare} color="gray.400" />
                </InputLeftElement>
                <Input
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  placeholder="What would users ask ?"
                  _placeholder={{ color: "gray" }}
                  color={"black"}
                  size="lg"
                  height="60px"
                  pl={12}
                  borderRadius="xl"
                  borderColor="gray.200"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "teal.400",
                    boxShadow: "0 0 0 1px teal.400",
                  }}
                />
              </InputGroup>
            </FormControl>

            <FormControl mb={10} position="relative">
              <Textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                size="lg"
                placeholder="How should the AI respond ?"
                _placeholder={{ color: "gray" }}
                color={"black"}
                rows={5}
                borderRadius="xl"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
                _focus={{
                  borderColor: "teal.400",
                  boxShadow: "0 0 0 1px teal.400",
                }}
                pt={6}
              />
            </FormControl>

            <Flex justify="center">
              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                px={12}
                height="56px"
                borderRadius="xl"
                isLoading={isSubmitting}
                loadingText="Teaching AI..."
                leftIcon={<Icon as={FiSend} />}
                bgGradient="linear(to-r, teal.400, teal.600)"
                _hover={{
                  bgGradient: "linear(to-r, teal.500, teal.700)",
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.2s"
              >
                Train Knowledge Base
              </Button>
            </Flex>
          </form>
        </CardBody>
      </Card>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent borderRadius="2xl" overflow="hidden">
          <ModalHeader bg="teal.500" color="white">
            <Flex align="center">
              <Icon as={FiCheckCircle} boxSize={6} mr={3} />
              <Text>Knowledge Added!</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={8}>
            <Flex direction="column" align="center" textAlign="center">
              <Icon as={FiCheckCircle} boxSize={12} color="teal.500" mb={4} />
              <Heading size="md" mb={2}>
                Training Successful
              </Heading>
              <Text color="gray.600">
                The AI assistant has learned this new information and will now
                be able to answer similar questions.
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={onClose}
              size="lg"
              borderRadius="xl"
              width="full"
            >
              Continue Teaching
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FAQTrainer;
