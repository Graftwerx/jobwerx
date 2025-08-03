import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await req.json();

  // Check if already applied
  const existing = await prisma.jobApplication.findFirst({
    where: {
      userId: session.user.id,
      jobId,
    },
  });

  if (existing) {
    return NextResponse.json({ alreadyApplied: true });
  }

  // Create application
  const newApp = await prisma.jobApplication.create({
    data: {
      userId: session.user.id,
      jobId,
    },
  });

  return NextResponse.json({ success: true, applicationId: newApp.id });
}

