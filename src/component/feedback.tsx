import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Tag,
  Select,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Icon,
  Badge,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiMessageSquare,
  FiClock,
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi";
import UseAuth from "../service/useAuth";

type Feedback = {
  id: number;
  feedback_text: string;
  feedback_type: "positive" | "negative";
  feedback_time: string;
  sector: string | null;
};

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "positive" | "negative">("ALL");

  useEffect(() => {
    const url = "https://Bewnet.pythonanywhere.com/";
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await fetch(url + "api/feedback");
        if (!response.ok) throw new Error("Failed to fetch feedbacks");
        const data: Feedback[] = await response.json();
        setFeedbacks(data);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Client-side filtering
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (filter === "ALL") return true;
    return feedback.feedback_type === filter;
  });

  // Color schemes
  const cardBg = useColorModeValue("white", "gray.700");
  const positiveScheme = useColorModeValue("green", "teal");
  const negativeScheme = useColorModeValue("red", "orange");

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md" variant="subtle">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }} maxW="1400px" mx="auto">
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        flexWrap="wrap"
        gap={4}
      >
        <Heading as="h2" size="xl" color="teal.600">
          Customer Feedback
        </Heading>

        <HStack spacing={4}>
          <Badge
            px={3}
            py={1}
            borderRadius="full"
            colorScheme="teal"
            fontSize="sm"
            variant="subtle"
          >
            {filteredFeedbacks.length}{" "}
            {filteredFeedbacks.length === 1 ? "Item" : "Items"}
          </Badge>

          <Select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "ALL" | "positive" | "negative")
            }
            minW="180px"
            borderRadius="md"
            variant="filled"
            focusBorderColor="teal.500"
          >
            <option value="ALL">All Feedback</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
          </Select>
        </HStack>
      </Flex>

      {filteredFeedbacks.length === 0 ? (
        <Box
          textAlign="center"
          p={12}
          borderRadius="lg"
          bg={useColorModeValue("gray.50", "gray.800")}
          borderWidth="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Icon as={FiMessageSquare} boxSize={8} mb={3} color="gray.400" />
          <Text fontSize="lg" color="gray.500">
            No feedback found matching your criteria
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredFeedbacks.map((feedback) => (
            <Card
              key={feedback.id}
              variant="elevated"
              borderLeftWidth="4px"
              borderLeftColor={
                feedback.feedback_type === "positive"
                  ? `${positiveScheme}.400`
                  : `${negativeScheme}.400`
              }
              bg={cardBg}
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "lg",
              }}
              transition="transform 0.2s, box-shadow 0.2s"
              h="100%"
              display="flex"
              flexDirection="column"
            >
              <CardHeader pb={2}>
                <Flex justify="space-between" align="flex-start" gap={2}>
                  <Tag
                    size="sm"
                    colorScheme={
                      feedback.feedback_type === "positive"
                        ? positiveScheme
                        : negativeScheme
                    }
                    borderRadius="full"
                    variant="subtle"
                    flexShrink={0}
                  >
                    <Flex align="center">
                      <Icon
                        as={
                          feedback.feedback_type === "positive"
                            ? FiThumbsUp
                            : FiThumbsDown
                        }
                        mr={1.5}
                      />
                      {feedback.feedback_type}
                    </Flex>
                  </Tag>
                  {feedback.sector && (
                    <Tooltip label={feedback.sector} placement="top">
                      <Badge
                        colorScheme="blue"
                        variant="outline"
                        borderRadius="full"
                        px={2}
                        py={1}
                        fontSize="xs"
                        maxW="120px"
                        isTruncated
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {feedback.sector}
                      </Badge>
                    </Tooltip>
                  )}
                </Flex>
              </CardHeader>

              <CardBody pt={0} flex={1}>
                <Stack spacing={3} h="100%">
                  <Text fontSize="md" lineHeight="tall" flex={1}>
                    {feedback.feedback_text}
                  </Text>

                  <Flex align="center" color="gray.500" fontSize="sm">
                    <Icon as={FiClock} mr={2} />
                    <Text>
                      {new Date(feedback.feedback_time).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </Text>
                  </Flex>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default FeedbackList;
