import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel, allyProps } from "./TabPanel";
import AllPage from "./AllPage";
import { TabPageContext } from "../../Provider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { EBasePage } from "../../Utils/enums";

//https://codesandbox.io/s/vjzmh?file=/src/App.js

//References
function TabPages() {
  const [value, setValue] = React.useState(0);
  const { tabPages, setTabPages } = React.useContext(TabPageContext);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function removeObjectByKey(key: string) {
    //Remove the tab by key and force a re-render
    let updatedObject = {
      ...tabPages,
    };
    delete updatedObject[key];
    setTabPages(updatedObject);
    setValue(0);
  }

  function checkApplyClose(key: string) {
    if (key !== EBasePage.HOME) {
      return (
        <IconButton component="div" onClick={() => removeObjectByKey(key)}>
          <CloseIcon />
        </IconButton>
      );
    }
  }

  return (
    <>
      <Tabs value={value} onChange={handleChange} aria-label="Global Header">
        {Object.keys(tabPages).map((key: string, i) => (
          <Tab
            value={i}
            label={
              <span>
                {tabPages[key]}
                {checkApplyClose(key)}
              </span>
            }
            {...allyProps(i)}
          />
        ))}
      </Tabs>

      {Object.keys(tabPages).map((key: string, i) => (
        <TabPanel value={value} index={i}>
          <AllPage mainPage={key} subPage={tabPages[key]} />
        </TabPanel>
      ))}
    </>
  );
}

export default TabPages;
