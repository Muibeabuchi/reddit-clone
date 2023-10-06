// import React from 'react'
import { useDebounce } from "@uidotdev/usehooks";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

export default function useSearchCommunities(searchTerm: string) {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchedCommunities = useQuery(api.community.searchedCommunities, {
    searchTerm: debouncedSearchTerm,
  });

  const loadingSearchedCommunities = searchedCommunities === undefined;

  return {
    searchedCommunities,
    loadingSearchedCommunities,
  };
}
