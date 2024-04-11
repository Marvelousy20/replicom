import {createContext} from 'react';

type UserContextType = {
  user:{
    walletAddress: string | null,
    AvatarUrl: string | null,
    balance: string | null,
    prediction_time: string | null,
  };
  setUser: React.Dispatch<
    React.SetStateAction<{
      walletAddress: string | null,
      AvatarUrl: string | null,
      balance: string | null,
      prediction_time: string | null,
    }>
  >;
}

export const UserContext = createContext<UserContextType>({
  user:{
    walletAddress:  null,
    AvatarUrl:  null,
    balance:  null,
    prediction_time: null,
  },
  setUser: () => { },
});