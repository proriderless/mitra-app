import React, { Dispatch } from "react";
import { EBasePage } from "./Utils/enums";
import App from "./App";
import { StyledEngineProvider } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as dotenv from 'dotenv'

interface ITabPageStore {
  [key: string]: string;
}

let tabPageState: ITabPageStore = {
  Home: EBasePage.HOME,
};

interface ITabPageContext {
  tabPages: ITabPageStore;
  setTabPages: Dispatch<ITabPageStore>;
}
const theme = createTheme();

export const TabPageContext = React.createContext<ITabPageContext>({
  tabPages: tabPageState,
  setTabPages: () => {},
});

function Provider() {
  const [tabPages, setTabPages] = React.useState(tabPageState);
  const value = { tabPages, setTabPages };

  return (
    <StyledEngineProvider injectFirst>
      <TabPageContext.Provider value={value}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </TabPageContext.Provider>
    </StyledEngineProvider>
  );
}

export default Provider;
