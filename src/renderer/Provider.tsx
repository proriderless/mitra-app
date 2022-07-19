import React, {Dispatch} from "react";
import {EBasePage} from './Utils/enums'
import App from './App'

interface ITabPageStore {
  [key: string]: string;
}

let tabPageState:ITabPageStore = {
    Home: EBasePage.HOME,
};

interface ITabPageContext {
    tabPages: ITabPageStore,
    setTabPages: Dispatch<ITabPageStore>
}

export const TabPageContext = React.createContext< ITabPageContext>({
    tabPages: tabPageState,
    setTabPages: () => {}
  });

function Provider() {
    const [tabPages, setTabPages] = React.useState(tabPageState);
    const value = { tabPages, setTabPages };

    return (
        <TabPageContext.Provider value={value}>
            <App/>
        </TabPageContext.Provider>
    )
}

export default Provider