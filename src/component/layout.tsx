import { Grid, GridItem } from "@chakra-ui/react";

import { Outlet } from "react-router-dom";
import ScrollToTop from "../router/scrollToTheTop";
import NavBar from "./NavBar";

function LayOut() {
  return (
    <>
      <Grid templateAreas={`"nav" "main"`}>
        <GridItem
          boxShadow="3px 3px 3px 3px #B0B0B0"
          bg={"#219B9D"}
          area={"nav"}
          paddingX={"10px"}
          position={"fixed"}
          width={"100%"}
          zIndex={1}
        >
          <NavBar />
        </GridItem>
        <GridItem marginTop={"40px"} area={"main"}>
          <Outlet />
        </GridItem>
      </Grid>
    </>
  );
}

export default LayOut;
