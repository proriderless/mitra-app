import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { displayPartsToString } from "typescript";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      }
    </div>
  );
}

export function allyProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
