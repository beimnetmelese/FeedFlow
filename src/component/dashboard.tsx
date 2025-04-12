import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

// Type definitions for our API responses
type FeedbackStats = {
  total_feedbacks: number;
  total_positive: number;
  total_negative: number;
  sector_breakdown: {
    [sector: string]: {
      total: number;
      positive: number;
      negative: number;
    };
  };
};

type Feedback = {
  id: number;
  feedback_text: string;
  feedback_type: "POSITIVE" | "NEGATIVE";
  feedback_time: string;
  sector: string | null;
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = "http://127.0.0.1:8000/";
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch stats
        const statsResponse = await fetch(url + "api/feedbackstats/?days=7");
        if (!statsResponse.ok) throw new Error("Failed to fetch stats");
        const statsData: FeedbackStats = await statsResponse.json();
        setStats(statsData);

        // Fetch recent feedbacks
        const feedbacksResponse = await fetch(url + "api/feedback");
        if (!feedbacksResponse.ok) throw new Error("Failed to fetch feedbacks");
        const feedbacksData: Feedback[] = await feedbacksResponse.json();
        setFeedbacks(feedbacksData);

        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert status="info">
        <AlertIcon />
        No data available
      </Alert>
    );
  }

  // Prepare data for charts
  const sentimentData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        data: [stats.total_positive, stats.total_negative],
        backgroundColor: ["#48BB78", "#F56565"],
        hoverBackgroundColor: ["#38A169", "#E53E3E"],
      },
    ],
  };

  const sectors = Object.keys(stats.sector_breakdown);
  const sectorPositiveData = sectors.map(
    (sector) => stats.sector_breakdown[sector].positive
  );
  const sectorNegativeData = sectors.map(
    (sector) => stats.sector_breakdown[sector].negative
  );

  const sectorChartData = {
    labels: sectors,
    datasets: [
      {
        label: "Positive",
        data: sectorPositiveData,
        backgroundColor: "#48BB78",
      },
      {
        label: "Negative",
        data: sectorNegativeData,
        backgroundColor: "#F56565",
      },
    ],
  };

  // Mock data for last 7 days (you would replace this with actual data from your API)
  const lastSevenDays = [
    "Day 1",
    "Day 2",
    "Day 3",
    "Day 4",
    "Day 5",
    "Day 6",
    "Day 7",
  ];
  const lastSevenDaysPositive = [12, 19, 15, 8, 12, 10, 9];
  const lastSevenDaysNegative = [4, 3, 5, 7, 2, 5, 4];

  const trendData = {
    labels: lastSevenDays,
    datasets: [
      {
        label: "Positive",
        data: lastSevenDaysPositive,
        borderColor: "#48BB78",
        backgroundColor: "rgba(72, 187, 120, 0.1)",
        tension: 0.1,
        fill: true,
      },
      {
        label: "Negative",
        data: lastSevenDaysNegative,
        borderColor: "#F56565",
        backgroundColor: "rgba(245, 101, 101, 0.1)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <Box p={6}>
      <Heading as="h1" size="xl" mb={8} color="teal.500">
        Feedback Dashboard
      </Heading>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card bg={cardBg} boxShadow="md">
          <CardBody>
            <Stat>
              <StatLabel>Total Feedbacks</StatLabel>
              <StatNumber>{stats.total_feedbacks}</StatNumber>
              <StatHelpText>Today</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} boxShadow="md">
          <CardBody>
            <Stat>
              <StatLabel>Positive Feedbacks</StatLabel>
              <StatNumber>{stats.total_positive}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {((stats.total_positive / stats.total_feedbacks) * 100).toFixed(
                  1
                )}
                %
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} boxShadow="md">
          <CardBody>
            <Stat>
              <StatLabel>Negative Feedbacks</StatLabel>
              <StatNumber>{stats.total_negative}</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                {((stats.total_negative / stats.total_feedbacks) * 100).toFixed(
                  1
                )}
                %
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Charts Section */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={8}>
        <Card bg={cardBg} boxShadow="md">
          <CardHeader>
            <Heading size="md">Feedback Sentiment</Heading>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <Pie
                data={sentimentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </Box>
          </CardBody>
        </Card>

        <Card bg={cardBg} boxShadow="md">
          <CardHeader>
            <Heading size="md">Feedback by Sector</Heading>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <Bar
                data={sectorChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                    },
                  },
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </Box>
          </CardBody>
        </Card>
      </Grid>

      {/* Trend Chart */}
      <Card bg={cardBg} boxShadow="md" mb={8}>
        <CardHeader>
          <Heading size="md">Feedback Trend (Last 7 Days)</Heading>
        </CardHeader>
        <CardBody>
          <Box h="300px">
            <Line
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </Box>
        </CardBody>
      </Card>

      {/* Recent Feedbacks */}
      <Card bg={cardBg} boxShadow="md">
        <CardHeader>
          <Heading size="md">Recent Feedbacks</Heading>
        </CardHeader>
        <CardBody>
          {feedbacks.length === 0 ? (
            <Text>No recent feedbacks available</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {feedbacks.map((feedback) => (
                <Box
                  key={feedback.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={
                    feedback.feedback_type === "POSITIVE"
                      ? "green.200"
                      : "red.200"
                  }
                  bg={
                    feedback.feedback_type === "POSITIVE"
                      ? "green.50"
                      : "red.50"
                  }
                >
                  <Flex justify="space-between" mb={2}>
                    <Text
                      fontWeight="bold"
                      color={
                        feedback.feedback_type === "POSITIVE"
                          ? "green.600"
                          : "red.600"
                      }
                    >
                      {feedback.feedback_type}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(feedback.feedback_time).toLocaleString()}
                    </Text>
                  </Flex>
                  <Text mb={2}>{feedback.feedback_text}</Text>
                  {feedback.sector && (
                    <Text fontSize="sm" color="gray.600">
                      Sector: {feedback.sector}
                    </Text>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default Dashboard;
