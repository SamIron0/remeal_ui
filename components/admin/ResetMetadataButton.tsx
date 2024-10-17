"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function ResetMetadataButton() {
  const supabase = createClient();
  const handleReset = async () => {
    // Reset page metadata
    const pageMetadataResponse = await fetch("/api/admin/reset-search-page-metadata", {
      method: "POST",
    });
    if (!pageMetadataResponse.ok) {
      console.log("Failed to reset page metadata", pageMetadataResponse);
      return;
    }
    alert("Page metadata has been reset successfully");
  };
  return <Button onClick={handleReset}>{"Reset Search Page Metadata"}</Button>;
}
