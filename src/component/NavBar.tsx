import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Text,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";
import {
  FiHome,
  FiBarChart2,
  FiMessageSquare,
  FiHelpCircle,
  FiMenu,
} from "react-icons/fi";

const NavBar = () => {
  // Color mode values
  const navBg = useColorModeValue("white", "gray.800");
  const navColor = useColorModeValue("gray.800", "white");
  const hoverBg = useColorModeValue("teal.50", "teal.800");
  const activeColor = useColorModeValue("teal.600", "teal.200");

  // Navigation items
  const navItems = [
    { path: "/dashboard", icon: FiHome, label: "Dashboard" },
    { path: "/feedback", icon: FiMessageSquare, label: "Feedback" },
    { path: "/analytic", icon: FiBarChart2, label: "Analytics" },
    { path: "/faq", icon: FiHelpCircle, label: "FAQ" },
  ];

  return (
    <Box
      as="nav"
      bg={navBg}
      color={navColor}
      px={{ base: 4, md: 6 }}
      py={3}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex="sticky"
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {/* Logo */}
        <Link to="/">
          <HStack spacing={3}>
            <Image
              src="/logo.png"
              boxSize={{ base: "36px", md: "40px" }}
              alt="Logo"
            />
            <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
              Admin Panel
            </Text>
          </HStack>
        </Link>

        {/* Desktop Navigation */}
        <Show above="md">
          <HStack as="ul" spacing={{ base: 4, lg: 6 }} listStyleType="none">
            {navItems.map((item) => (
              <Box as="li" key={item.path}>
                <Link to={item.path}>
                  <Button
                    variant="ghost"
                    leftIcon={<Icon as={item.icon} />}
                    color="current"
                    _hover={{
                      bg: hoverBg,
                      color: activeColor,
                    }}
                    _active={{
                      color: activeColor,
                    }}
                    px={3}
                    py={2}
                  >
                    {item.label}
                  </Button>
                </Link>
              </Box>
            ))}
          </HStack>
        </Show>

        {/* Mobile Navigation */}
        <Show below="md">
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              aria-label="Navigation menu"
              px={2}
            >
              <FiMenu size={5} />
            </MenuButton>
            <MenuList
              bg={navBg}
              borderColor={useColorModeValue("gray.200", "gray.700")}
              minW="150px"
            >
              {navItems.map((item) => (
                <Link to={item.path} key={item.path}>
                  <MenuItem
                    icon={<Icon as={item.icon} />}
                    _hover={{
                      bg: hoverBg,
                      color: activeColor,
                    }}
                  >
                    {item.label}
                  </MenuItem>
                </Link>
              ))}
            </MenuList>
          </Menu>
        </Show>
      </Flex>
    </Box>
  );
};

export default NavBar;
