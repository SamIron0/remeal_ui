"use client";

import { Button } from "@/components/ui/button";

export default function ResetMetadataButton() {
  const handleReset = async () => {
    // Reset page metadata
    const pageMetadataResponse = await fetch("/api/admin/reset-search-page-metadata", {
      method: "POST",
    });
    if (!pageMetadataResponse.ok) {
      return;
    }
    alert("Page metadata has been reset successfully");
  };
  return <Button onClick={handleReset}>{"Reset Search Page Metadata"}</Button>;
}
