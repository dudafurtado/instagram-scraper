"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchFilterProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
  filtered?: number;
  total?: number;
}

export default function SearchFilter({
  onSearch,
  placeholder = "Search by name or username...",
  className = "",
  filtered,
  total,
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fccc63] focus:border-transparent text-white"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {searchTerm && (
        <p className="text-xs text-gray-500 mt-2">
          Showing {filtered} of {total} | Searching for: "{searchTerm}"
        </p>
      )}
    </div>
  );
}
