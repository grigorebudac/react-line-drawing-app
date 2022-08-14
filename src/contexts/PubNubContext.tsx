import React, { useContext, createContext } from "react";

interface PubNubContextValues {}

export const PubNubContextProvider = (props: React.PropsWithChildren) => {
  return (
    <PubNubContext.Provider value={{}}>{props.children}</PubNubContext.Provider>
  );
};

const PubNubContext = createContext<PubNubContextValues>(
  {} as PubNubContextValues
);

export const usePubNubContext = () => useContext(PubNubContext);
