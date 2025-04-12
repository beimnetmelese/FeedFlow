import { Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function LayOut() {
  return (
    <>
      <Grid templateAreas={`"nav" "main"`}>
        <GridItem
          area={"nav"}
          paddingX={"10px"}
          position={"fixed"}
          width={"100%"}
          zIndex={1}
        >
          <NavBar />
        </GridItem>
        <GridItem marginTop={"80px"} area={"main"}>
          <Outlet />
        </GridItem>
      </Grid>
    </>
  );
}

export default LayOut;
