import Link from "next/link";
import { Card, CardHeader } from "../ui/card";

import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { MapPin } from "lucide-react";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";

interface iAppProps {
  job: {
    id: string;
    jobTitle: string;
    employmentType: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
    createdAt: Date;
    Company: {
      about: string;
      name: string;
      location: string;
      logo: string;
    };
  };
}

export function JobCard({ job }: iAppProps) {
  return (
    <Link href={`/job/${job.id}`}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <Image
              src={job.Company.logo}
              alt={job.Company.name}
              width={48}
              height={48}
              className="size-12 rounded-lg"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{job.jobTitle}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <p className="text-sm text-muted-foreground">
                  {job.Company.name}
                </p>
                <span className="hidden md:inline text-muted-foreground">
                  *
                </span>
                <Badge className="rounded-full" variant={"secondary"}>
                  {job.employmentType}
                </Badge>
                <span className="hidden md:inline text-muted-foreground">
                  *
                </span>
                <Badge className="rounded-full" variant={"secondary"}>
                  {job.location}
                </Badge>
                <span className="hidden md:inline text-muted-foreground">
                  *
                </span>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(job.salaryFrom)} -{" "}
                  {formatCurrency(job.salaryTo)}
                </p>
              </div>
            </div>
            <div className="md:ml-auto">
              <div className="flex items-center gap-2 justify-end">
                <MapPin className="size-4" />
                <h1>{job.location}</h1>
              </div>
              <p className="text-sm text-muted-foreground md:text-right">
                {formatRelativeTime(job.createdAt)}
              </p>
            </div>
          </div>
          {/* !mt-5 ovverides auto margin in card header component ui*/}
          <p className="text-base text-muted-foreground line-clamp-2 !mt-5">
            {job.Company.about}
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}
