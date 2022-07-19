import React from "react";
import "./App.css";
import { Drawer } from "@mui/material";
import SideBarComp from "./UiComponents/SideBar";
import Box from "@mui/material/Box";
import TabPages from "./UiComponents/Tab";
import { EBasePage } from "./Utils/enums";

// This is the entrance page.
// All their subsequential components are stored in TabPages which will display the appropriate files

interface ITabPageStore {
  [key: string]: string;
}

function App() {
  const drawerWidth = "240";

  //Initialize Tab Origin pages
  /* 
    Format: base page: sub page
    {
      home: 'home'
      gallery: 'explorer',
      anime: 'season viewer'
    }

  */

  return (
      <Box sx={{ display: "flex" }}>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 10 } }}
          aria-label="mailbox folders"
        >
          <SideBarComp />
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <TabPages />
        </Box>
      </Box>
  );
}

export default App;
