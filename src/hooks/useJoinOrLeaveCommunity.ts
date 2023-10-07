// todo ====== create a custom hook that utilizes the auth id to check if a user exists and if not, opens the auth modal , if user exists, adds or removes them from a community

// import React from 'react'
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
export default function useJoinOrLeaveCommunity() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const joinOrLeaveCommunity = useMutation(api.community.joinOrLeaveCommunity);

  async function onJoinOrLeaveCommunity(communityName: string) {
    if (!user) return; // openAuthModal();
    //todo ---- later add functionality to open the  auth modal
    setLoading(true);
    try {
      await joinOrLeaveCommunity({
        communityName,
      });
    } catch (error) {
      // console.log(error);
    }
    setLoading(false);
  }

  return {
    onJoinOrLeaveCommunity,
    loading,
  };
}
