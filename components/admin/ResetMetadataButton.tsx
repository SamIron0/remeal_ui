"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function ResetButton() {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    // Reset page metadata
    const pageMetadataResponse = await fetch("/api/admin/reset-page-metadata", {
      method: "POST",
    });
    if (!pageMetadataResponse.ok) {
      console.log("Failed to reset page metadata", pageMetadataResponse);
    }
    alert("Page metadata has been reset successfully");
  };
  return (
    <Button onClick={handleReset} disabled={isResetting}>
      {isResetting ? "Resetting..." : "Reset Page Metadata"}
    </Button>
  );
}
