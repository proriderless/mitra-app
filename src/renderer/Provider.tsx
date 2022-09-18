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
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#00da61',
    },
    secondary: {
      main: '#7deba7',
    },
  },
  components: {
    MuiButton: {
        styleOverrides: {
            root: {
              background: 'linear-gradient(45deg, #28313B 30%, #485461 90%)',
              border: 0,
              borderRadius: 20,
              //boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              color: 'white',
              height: 48,
              padding: '0 30px',
            }
        }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
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
