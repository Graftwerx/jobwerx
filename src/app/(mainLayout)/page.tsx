// import Image from "next/image";

import { JobFilter } from "@/components/general/JobFilterCity";
import { JobListings } from "@/components/general/JobListCity";
import { JobListingsLoading } from "@/components/general/JobListingsLoading";
import { Suspense } from "react";

type SearchParams = {
  searchParams: Promise<{
    page?: string;
    jobTypes?: string;
    location?: string;
    city?: string;
  }>;
};

export default async function Home({ searchParams }: SearchParams) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const jobTypes = params.jobTypes?.split(",") || [];
  const location = params.location || "";
  const city = params.city || "";

  const filterKey = `page=${currentPage};types=${jobTypes.join(",")};location=${location};city=${city}`;
  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilter />
      <div className="col-span-2 flex flex-col gap-6">
        <Suspense fallback={<JobListingsLoading key={filterKey} />}>
          <JobListings
            currentPage={currentPage}
            jobTypes={jobTypes}
            location={location}
            city={city}
          />
        </Suspense>
      </div>
    </div>
  );
}
