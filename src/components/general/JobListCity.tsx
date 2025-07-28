import { prisma } from "@/app/utils/db";
import { EmptyState } from "./EmptyState";
import { JobCard } from "./JobCard";
import { MainPagination } from "./MainPagination";
import { JobPostStatus, Prisma } from "@prisma/client";

async function getData({
  page = 1,
  pageSize = 3,
  jobTypes = [],
  location = "",
  city = "",
}: {
  page: number;
  pageSize: number;
  jobTypes: string[];
  location: string;
  city: string;
}) {
  const skip = (page - 1) * pageSize;

  const where = {
    status: JobPostStatus.ACTIVE,
    ...(jobTypes.length > 0 && {
      employmentType: {
        in: jobTypes,
      },
    }),
    ...(location &&
      location !== "worldwide" && {
        location: location,
      }),
    ...(city && {
      cityId: BigInt(city),
    }),
  };

  const [data, totalCount] = await Promise.all([
    prisma.jobPost.findMany({
      where: where,
      take: pageSize,
      skip: skip,
      select: {
        jobTitle: true,
        id: true,
        salaryFrom: true,
        salaryTo: true,
        employmentType: true,
        location: true,
        createdAt: true,
        Company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
        city: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.jobPost.count({
      where: {
        status: JobPostStatus.ACTIVE,
        ...(location &&
          location !== "worldwide" && {
            location: location,
          }),
        ...(jobTypes.length > 0 && {
          employmentType: {
            in: jobTypes,
          },
        }),
        ...(city && {
          city: {
            is: {
              OR: [
                { city: { contains: city, mode: "insensitive" } },
                { country: { contains: city, mode: "insensitive" } },
              ],
            } satisfies Prisma.CityWhereInput,
          },
        }),
      },
    }),
  ]);

  return {
    jobs: data,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function JobListings({
  currentPage,
  jobTypes,
  location,
  city,
}: {
  currentPage: number;
  jobTypes: string[];
  location: string;
  city: string;
}) {
  const { jobs, totalPages } = await getData({
    page: currentPage,
    pageSize: 3,
    jobTypes: jobTypes,
    location: location,
    city: city,
  });

  return (
    <>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Please adjust your search"
          buttonText="clear all filters"
          href="/"
        />
      )}
      <div className="flex justify-center mt-6">
        <MainPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </>
  );
}
