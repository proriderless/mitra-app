import React, { Dispatch } from "react";
import { EBasePage } from "./Utils/enums";
import App from "./App";
import { StyledEngineProvider } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';


interface ITabPageStore {
  [key: string]: string;
}

let tabPageState: ITabPageStore = {
  Home: EBasePage.HOME,
};

export const themeOptions = {
  typography: {
    fontFamily: 'Barlow, Arial'
  },
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#29AB87',
    },
    secondary: {
      main: '#29AB87',
    },
  },
  components: {
 
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "@font-face": {
            fontFamily: "Barlow",
            fontStyle: "normal",
            fontWeight: "400",
            src: "url(https://fonts.gstatic.com/s/barlow/v12/7cHpv4kjgoGqM7E_DMs5.woff2) format('woff2')",
            unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"
          },
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
            borderRadius: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            maxWidth: 2,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
            border: "3px solid #2b2b2b",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
}
};


interface ITabPageContext {
  tabPages: ITabPageStore;
  setTabPages: Dispatch<ITabPageStore>;
}
const theme = createTheme(themeOptions);

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
          <CssBaseline />
          <App />
        </ThemeProvider>
      </TabPageContext.Provider>
    </StyledEngineProvider>
  );
}

export default Provider;
