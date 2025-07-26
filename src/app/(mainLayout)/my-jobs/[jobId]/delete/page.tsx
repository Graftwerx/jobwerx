import { deleteJobPost } from "@/app/utils/actions";
import { requireUser } from "@/app/utils/requireUser";
import { GeneralSubmitButton } from "@/components/general/SubmitButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, TrashIcon } from "lucide-react";
import Link from "next/link";

type Params = Promise<{ jobId: string }>;

export default async function DeleteJob({ params }: { params: Params }) {
  const { jobId } = await params;
  await requireUser();
  return (
    <div>
      <Card className="max-w-lg mx-auto mt-24">
        <CardHeader>
          <CardTitle>Are you sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this
            record.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-between">
          <Link href={"/my-jobs"} className={buttonVariants()}>
            <ArrowLeft />
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteJobPost(jobId);
            }}
          >
            <GeneralSubmitButton
              text="Delete"
              variant={"destructive"}
              icon={<TrashIcon />}
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
