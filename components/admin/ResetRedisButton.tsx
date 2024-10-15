"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function ResetButton() {
  const [isResetting, setIsResetting] = useState(false);
  const supabase = createClient();

  const handleReset = async () => {
    setIsResetting(true);
    try {
      // Reset Redis cache
      const redisResponse = await fetch("/api/admin/reset-redis", {
        method: "POST",
      });
      if (!redisResponse.ok) {
        throw new Error("Failed to reset Redis cache");
      }
 
    } catch (error) {
      console.error(
        "Error resetting Redis cache:",
        error
      );
      alert(
        "Failed to reset Redis cache . Please try again."
      );
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Button onClick={handleReset} disabled={isResetting}>
      {isResetting ? "Resetting..." : "Reset Redis Cache and Update Metadata"}
    </Button>
  );
}
