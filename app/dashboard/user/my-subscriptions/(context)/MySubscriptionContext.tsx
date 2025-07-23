import React, { createContext, useContext } from 'react';

const MyContext = createContext({
  neighbourhoods: [] as number[]
});

export const useMySubcriptionsContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    return undefined
  }
  return context;
};

// Provider that accepts external value
export const MySubcriptionsProvider = ({ children, value }:any) => {
  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};
