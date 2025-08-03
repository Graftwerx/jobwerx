"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ApplyButton({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);

    // Show instant optimistic toast
    const toastId = toast.loading("Submitting your application...");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Application submitted successfully!", { id: toastId });
      } else {
        toast.error(data.error || "Something went wrong", { id: toastId });
      }
    } catch {
      toast.error("Server error, please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="w-full py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
    >
      {loading ? "Submitting..." : "Apply Now"}
    </button>
  );
}
