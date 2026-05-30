import { useState } from "react";
import { AVAILABLE_ICONS } from "@/data/icon";

export function useUserSetup() {
  const [userName, setUserName] = useState("");
  const [selectedIconId, setSelectedIconId] = useState(AVAILABLE_ICONS[0].id);

  return {
    userName,
    setUserName,
    selectedIconId,
    setSelectedIconId,
  };
}
