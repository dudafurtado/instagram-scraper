"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Credentials, CollectionData, ScraperUser } from "@/types";

interface AppContextType {
  credentials: boolean;
  setCredentials: (data: boolean) => void;
  collectionData: CollectionData;
  setCollectionData: (data: CollectionData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  currentUser: ScraperUser | null;
  setCurrentUser: (data: ScraperUser | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<CollectionData>({
    followers: [],
    following: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<ScraperUser | null>(null);

  return (
    <AppContext.Provider
      value={{
        credentials,
        setCredentials,
        collectionData,
        setCollectionData,
        isLoading,
        setIsLoading,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
