import { Redirect } from "expo-router";
import React from "react";
import { useUser } from "@/context/UserContext";
import { UserStateType } from "@/constants/types";

interface PageProps {
  onUserUpdated: (user: UserStateType) => void;
}

const Page = () => {
  return <Redirect href="/(main)/(tabs)/home" />;
};

export default Page;
