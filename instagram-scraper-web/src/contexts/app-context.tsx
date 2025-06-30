"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Credentials, CollectionData } from "@/types";

interface AppContextType {
  credentials: Credentials | null;
  setCredentials: (credentials: Credentials | null) => void;
  collectionData: CollectionData;
  setCollectionData: (data: CollectionData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [collectionData, setCollectionData] = useState<CollectionData>({
    followers: [],
    following: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  return (
    <AppContext.Provider
      value={{
        credentials,
        setCredentials,
        collectionData,
        setCollectionData,
        isLoading,
        setIsLoading,
        currentUserId,
        setCurrentUserId,
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
