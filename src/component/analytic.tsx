import React, { useState, useEffect } from "react";
import { FiDownload, FiFileText, FiFile, FiFileMinus } from "react-icons/fi";
import { utils as xlsxUtils, writeFile as xlsxWriteFile } from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Select,
  HStack,
  Badge,
  Progress,
  Divider,
  IconButton,
  Tooltip,
  Icon,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler
);

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

const timeRanges = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async (days: string) => {
    try {
      setLoading(true);
      const url =
        days === "all"
          ? "http://127.0.0.1:8000/api/feedbackstats"
          : `http://127.0.0.1:8000/api/feedbackstats/?days=${days}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data: FeedbackStats = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats(timeRange);
  }, [timeRange]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStats(timeRange);
  };

  const positivePercentage = stats
    ? Math.round((stats.total_positive / stats.total_feedbacks) * 100)
    : 0;
  const negativePercentage = stats
    ? Math.round((stats.total_negative / stats.total_feedbacks) * 100)
    : 0;

  // Prepare data for charts
  const sentimentData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        data: [stats?.total_positive || 0, stats?.total_negative || 0],
        backgroundColor: ["#38A169", "#E53E3E"],
        hoverBackgroundColor: ["#48BB78", "#F56565"],
        borderWidth: 1,
      },
    ],
  };

  const sectors = stats ? Object.keys(stats.sector_breakdown) : [];
  const sectorPositiveData = sectors.map(
    (sector) => stats?.sector_breakdown[sector].positive || 0
  );
  const sectorNegativeData = sectors.map(
    (sector) => stats?.sector_breakdown[sector].negative || 0
  );
  const sectorTotalData = sectors.map(
    (sector) => stats?.sector_breakdown[sector].total || 0
  );

  const sectorChartData = {
    labels: sectors,
    datasets: [
      {
        label: "Positive",
        data: sectorPositiveData,
        backgroundColor: "#38A169",
        borderColor: "#38A169",
        borderWidth: 1,
      },
      {
        label: "Negative",
        data: sectorNegativeData,
        backgroundColor: "#E53E3E",
        borderColor: "#E53E3E",
        borderWidth: 1,
      },
    ],
  };

  const sectorDistributionData = {
    labels: sectors,
    datasets: [
      {
        label: "Total Feedback",
        data: sectorTotalData,
        backgroundColor: [
          "#3182CE",
          "#805AD5",
          "#D53F8C",
          "#DD6B20",
          "#38A169",
          "#E53E3E",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Mock data for trend - in a real app you'd get this from your API
  const generateTrendData = () => {
    const days = timeRange === "all" ? 90 : parseInt(timeRange);
    return {
      labels: Array.from({ length: days }, (_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: "Positive",
          data: Array.from(
            { length: days },
            () => Math.floor(Math.random() * 50) + 10
          ),
          borderColor: "#38A169",
          backgroundColor: "rgba(56, 161, 105, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Negative",
          data: Array.from(
            { length: days },
            () => Math.floor(Math.random() * 20) + 5
          ),
          borderColor: "#E53E3E",
          backgroundColor: "rgba(229, 62, 62, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  // Export functions
  const exportToCSV = () => {
    if (!stats) return;

    const csvContent = [
      ["Metric", "Value"],
      ["Total Feedbacks", stats.total_feedbacks],
      ["Positive Feedbacks", stats.total_positive],
      ["Negative Feedbacks", stats.total_negative],
      ["Positive Percentage", `${positivePercentage}%`],
      ["Negative Percentage", `${negativePercentage}%`],
      [
        "Time Range",
        timeRanges.find((r) => r.value === timeRange)?.label || "",
      ],
      [],
      ["Sector", "Total", "Positive", "Negative", "Positive %", "Negative %"],
    ];

    // Add sector breakdown - ensure numbers remain as numbers
    Object.entries(stats.sector_breakdown).forEach(([sector, data]) => {
      const sectorPosPercent = Math.round((data.positive / data.total) * 100);
      const sectorNegPercent = Math.round((data.negative / data.total) * 100);
      csvContent.push([
        sector,
        data.total, // number
        data.positive, // number
        data.negative, // number
        `${sectorPosPercent}%`, // string with %
        `${sectorNegPercent}%`, // string with %
      ]);
    });

    // Convert to CSV string
    const csv = csvContent
      .map((row) =>
        row
          .map((cell) => (typeof cell === "number" ? cell : `"${cell}"`))
          .join(",")
      )
      .join("\n");

    // Download logic remains same
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `feedback_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (!stats) return;

    const workbook = xlsxUtils.book_new();

    // Main metrics sheet - numbers preserved
    const mainData = [
      ["Metric", "Value"],
      ["Total Feedbacks", stats.total_feedbacks],
      ["Positive Feedbacks", stats.total_positive],
      ["Negative Feedbacks", stats.total_negative],
      ["Positive Percentage", `${positivePercentage}%`],
      ["Negative Percentage", `${negativePercentage}%`],
      [
        "Time Range",
        timeRanges.find((r) => r.value === timeRange)?.label || "",
      ],
    ];
    const mainSheet = xlsxUtils.aoa_to_sheet(mainData);
    xlsxUtils.book_append_sheet(workbook, mainSheet, "Summary");

    // Sector breakdown sheet - numbers preserved
    const sectorData = [
      ["Sector", "Total", "Positive", "Negative", "Positive %", "Negative %"],
    ];
    Object.entries(stats.sector_breakdown).forEach(([sector, data]) => {
      const sectorPosPercent = Math.round((data.positive / data.total) * 100);
      const sectorNegPercent = Math.round((data.negative / data.total) * 100);
      sectorData.push([
        sector,
        String(data.total), // number
        String(data.positive), // number
        String(data.negative), // number
        `${sectorPosPercent}%`, // string
        `${sectorNegPercent}%`, // string
      ]);
    });

    const sectorSheet = xlsxUtils.aoa_to_sheet(sectorData);
    xlsxUtils.book_append_sheet(workbook, sectorSheet, "Sector Breakdown");

    xlsxWriteFile(
      workbook,
      `feedback_report_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const exportToPDF = () => {
    if (!stats) return;

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(18);
    doc.text("Feedback Analytics Report", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(
      `Generated on ${date} | Time Range: ${
        timeRanges.find((r) => r.value === timeRange)?.label
      }`,
      14,
      28
    );

    // Summary table
    autoTable(doc, {
      startY: 35,
      head: [["Metric", "Value"]],
      body: [
        ["Total Feedbacks", stats.total_feedbacks],
        ["Positive Feedbacks", stats.total_positive],
        ["Negative Feedbacks", stats.total_negative],
        ["Positive Percentage", `${positivePercentage}%`],
        ["Negative Percentage", `${negativePercentage}%`],
      ],
      theme: "grid",
      headStyles: { fillColor: [56, 161, 105] },
    });

    // Sector breakdown table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [
        ["Sector", "Total", "Positive", "Negative", "Positive %", "Negative %"],
      ],
      body: Object.entries(stats.sector_breakdown).map(([sector, data]) => {
        const sectorPosPercent = Math.round((data.positive / data.total) * 100);
        const sectorNegPercent = Math.round((data.negative / data.total) * 100);
        return [
          sector,
          data.total,
          data.positive,
          data.negative,
          `${sectorPosPercent}%`,
          `${sectorNegPercent}%`,
        ];
      }),
      theme: "grid",
      headStyles: { fillColor: [66, 153, 225] },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
      },
    });

    // Save the PDF
    doc.save(`feedback_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const trendData = generateTrendData();

  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");

  if (loading && !isRefreshing) {
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

  return (
    <Box p={6}>
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        flexWrap="wrap"
        gap={4}
      >
        <Heading as="h1" size="xl" color="teal.500">
          Feedback Analytics
        </Heading>

        <HStack spacing={4}>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            variant="filled"
            width="200px"
            icon={<FiCalendar />}
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </Select>

          <Tooltip label="Refresh data">
            <IconButton
              aria-label="Refresh data"
              icon={<FiRefreshCw />}
              onClick={handleRefresh}
              isLoading={isRefreshing}
            />
          </Tooltip>
        </HStack>
      </Flex>

      {stats && (
        <>
          {/* Summary Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
            <Card bg={cardBg} border="1px" borderColor={cardBorder}>
              <CardHeader pb={0}>
                <Stat>
                  <StatLabel fontSize="md">Total Feedbacks</StatLabel>
                  <StatNumber fontSize="3xl">
                    {stats.total_feedbacks}
                  </StatNumber>
                  <StatHelpText>
                    <Badge colorScheme="blue" variant="subtle">
                      {timeRanges.find((r) => r.value === timeRange)?.label}
                    </Badge>
                  </StatHelpText>
                </Stat>
              </CardHeader>
              <CardBody pt={0}>
                <Flex align="center">
                  <Box flex={1} mr={4}>
                    <Progress
                      value={positivePercentage}
                      colorScheme="green"
                      size="sm"
                      borderRadius="full"
                    />
                  </Box>
                  <Text fontSize="sm" color="gray.500">
                    {positivePercentage}% positive
                  </Text>
                </Flex>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={cardBorder}>
              <CardHeader pb={0}>
                <Stat>
                  <StatLabel fontSize="md">Positive Feedbacks</StatLabel>
                  <StatNumber fontSize="3xl">{stats.total_positive}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    <Text as="span" ml={1}>
                      {positivePercentage}% of total
                    </Text>
                  </StatHelpText>
                </Stat>
              </CardHeader>
              <CardBody pt={0}>
                <Flex align="center" color="green.500">
                  <Icon as={FiTrendingUp} boxSize={6} mr={2} />
                  <Text fontSize="sm">Customer satisfaction</Text>
                </Flex>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={cardBorder}>
              <CardHeader pb={0}>
                <Stat>
                  <StatLabel fontSize="md">Negative Feedbacks</StatLabel>
                  <StatNumber fontSize="3xl">{stats.total_negative}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="decrease" />
                    <Text as="span" ml={1}>
                      {negativePercentage}% of total
                    </Text>
                  </StatHelpText>
                </Stat>
              </CardHeader>
              <CardBody pt={0}>
                <Flex align="center" color="red.500">
                  <Icon as={FiTrendingDown} boxSize={6} mr={2} />
                  <Text fontSize="sm">Areas needing improvement</Text>
                </Flex>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Analytics */}
          <Tabs variant="enclosed" isFitted mb={8}>
            <TabList>
              <Tab>
                <HStack spacing={2}>
                  <FiBarChart2 />
                  <Text>Overview</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <FiPieChart />
                  <Text>Sector Analysis</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <FiTrendingUp />
                  <Text>Trends</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0} pt={6}>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  <Card bg={cardBg} border="1px" borderColor={cardBorder}>
                    <CardHeader>
                      <Heading size="md">Sentiment Distribution</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <Doughnut
                          data={sentimentData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "bottom",
                              },
                              tooltip: {
                                callbacks: {
                                  label: (context) => {
                                    const label = context.label || "";
                                    const value = context.raw as number;
                                    const total = context.dataset.data.reduce(
                                      (a, b) => a + b,
                                      0
                                    );
                                    const percentage = Math.round(
                                      (value / total) * 100
                                    );
                                    return `${label}: ${value} (${percentage}%)`;
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </Box>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} border="1px" borderColor={cardBorder}>
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
                                beginAtZero: true,
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
              </TabPanel>

              <TabPanel p={0} pt={6}>
                <Card bg={cardBg} border="1px" borderColor={cardBorder} mb={6}>
                  <CardHeader>
                    <Heading size="md">Sector Distribution</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="400px">
                      <Pie
                        data={sectorDistributionData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                            },
                            tooltip: {
                              callbacks: {
                                label: (context) => {
                                  const label = context.label || "";
                                  const value = context.raw as number;
                                  const total = context.dataset.data.reduce(
                                    (a, b) => a + b,
                                    0
                                  );
                                  const percentage = Math.round(
                                    (value / total) * 100
                                  );
                                  return `${label}: ${value} (${percentage}%)`;
                                },
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </CardBody>
                </Card>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                  {sectors.map((sector) => {
                    const sectorData = stats.sector_breakdown[sector];
                    const sectorPositivePercent = Math.round(
                      (sectorData.positive / sectorData.total) * 100
                    );
                    const sectorNegativePercent = Math.round(
                      (sectorData.negative / sectorData.total) * 100
                    );

                    return (
                      <Card
                        key={sector}
                        bg={cardBg}
                        border="1px"
                        borderColor={cardBorder}
                      >
                        <CardHeader pb={2}>
                          <Heading size="sm">{sector}</Heading>
                        </CardHeader>
                        <CardBody pt={0}>
                          <HStack spacing={3}>
                            <Stat>
                              <StatLabel>Total Feedback</StatLabel>
                              <StatNumber>{sectorData.total}</StatNumber>
                              <StatHelpText>
                                {Math.round(
                                  (sectorData.total / stats.total_feedbacks) *
                                    100
                                )}
                                % of all feedback
                              </StatHelpText>
                            </Stat>

                            <Divider />

                            <Box>
                              <Flex justify="space-between" mb={1}>
                                <Text fontSize="sm" color="green.500">
                                  Positive
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {sectorData.positive} ({sectorPositivePercent}
                                  %)
                                </Text>
                              </Flex>
                              <Progress
                                value={sectorPositivePercent}
                                colorScheme="green"
                                size="sm"
                                borderRadius="full"
                              />
                            </Box>

                            <Box>
                              <Flex justify="space-between" mb={1}>
                                <Text fontSize="sm" color="red.500">
                                  Negative
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {sectorData.negative} ({sectorNegativePercent}
                                  %)
                                </Text>
                              </Flex>
                              <Progress
                                value={sectorNegativePercent}
                                colorScheme="red"
                                size="sm"
                                borderRadius="full"
                              />
                            </Box>
                          </HStack>
                        </CardBody>
                      </Card>
                    );
                  })}
                </SimpleGrid>
              </TabPanel>

              <TabPanel p={0} pt={6}>
                <Card bg={cardBg} border="1px" borderColor={cardBorder}>
                  <CardHeader>
                    <Heading size="md">Feedback Trends</Heading>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Historical feedback data over time
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <Box h="400px">
                      <Line
                        data={trendData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          interaction: {
                            mode: "index",
                            intersect: false,
                          },
                          plugins: {
                            legend: {
                              position: "bottom",
                            },
                            tooltip: {
                              mode: "index",
                              intersect: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: "Number of Feedbacks",
                              },
                            },
                            x: {
                              title: {
                                display: true,
                                text: "Timeline",
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* Key Metrics */}
          <Card bg={cardBg} border="1px" borderColor={cardBorder} mb={8}>
            <CardHeader>
              <Heading size="md">Key Metrics</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <Box textAlign="center">
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    Positive Rate
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    {positivePercentage}%
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    of all feedback
                  </Text>
                </Box>

                <Box textAlign="center">
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    Negative Rate
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="red.500">
                    {negativePercentage}%
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    of all feedback
                  </Text>
                </Box>

                <Box textAlign="center">
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    Avg. Daily Feedback
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {Math.round(
                      stats.total_feedbacks /
                        (timeRange === "all" ? 90 : parseInt(timeRange))
                    )}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    based on selected period
                  </Text>
                </Box>

                <Box textAlign="center">
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    Top Sector
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {sectors.reduce((a, b) =>
                      stats.sector_breakdown[a].total >
                      stats.sector_breakdown[b].total
                        ? a
                        : b
                    )}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    by feedback volume
                  </Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>
        </>
      )}
      <Flex justify="flex-end" mt={8}>
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<FiDownload />}
            colorScheme="teal"
            variant="outline"
          >
            Export Report
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FiFileText />} onClick={exportToCSV}>
              Download as CSV
            </MenuItem>
            <MenuItem icon={<FiFile />} onClick={exportToExcel}>
              Download as Excel
            </MenuItem>
            <MenuItem icon={<FiFileMinus />} onClick={exportToPDF}>
              Download as PDF
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default AnalyticsDashboard;
