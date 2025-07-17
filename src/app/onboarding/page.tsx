import { OnboardingForm } from "@/components/forms/onboarding/OnboardingForm";
import { prisma } from "../utils/db";
import { redirect } from "next/navigation";
import { requireUser } from "../utils/requireUser";

async function checkUserOnboardingComplete(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      onboardingCompleted: true,
    },
  });
  if (user?.onboardingCompleted === true) {
    return redirect("/");
  }
  return user;
}

export default async function OnboardingPage() {
  const session = await requireUser();
  await checkUserOnboardingComplete(session.id as string);
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center py-10">
      <OnboardingForm />
    </div>
  );
}
