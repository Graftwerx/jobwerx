"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ApplyButton({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    if (applied || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to apply");
      } else if (data.alreadyApplied) {
        toast.info("You have already applied for this job.");
        setApplied(true);
      } else {
        toast.success("Application submitted successfully!");
        setApplied(true);
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={loading || applied}
      className={`w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50`}
    >
      {loading ? "Submitting..." : applied ? "Applied" : "Apply Now"}
    </button>
  );
}
