"use client";

import { useState, useMemo, useCallback } from "react";
import type { User } from "@/types";

export function useUserFilter(users: User[]) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const term = searchTerm.toLowerCase().trim();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(term) ||
        user.full_name.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    searchTerm,
    filteredUsers,
    handleSearch,
    clearSearch,
    hasResults: filteredUsers.length > 0,
    totalUsers: users.length,
    filteredCount: filteredUsers.length,
  };
}
