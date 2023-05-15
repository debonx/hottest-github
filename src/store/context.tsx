import { Dispatch, SetStateAction, createContext } from 'react';

interface IAppState {
    myData: number;
  }
  
interface IContextProps {
    appState: IAppState;
    setAppState: Dispatch<SetStateAction<IAppState>>;
}
  
export const AppStateContext = createContext<IContextProps | undefined>(undefined);