import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";
import { auth } from "@/app/utils/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    // 1️⃣ Check if user has already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }

    // 2️⃣ Create job application
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        userId: session.user.id,
      },
      include: {
        JobPost: {
          include: {
            Company: {
              include: {
                user: true, // Get the company owner's email
              },
            },
          },
        },
        User: true, // Get applicant info
      },
    });

    const applicantEmail = application.User.email;
    const companyEmail = application.JobPost.Company.user.email;
    const jobTitle = application.JobPost.jobTitle;
    const companyName = application.JobPost.Company.name;

    // 3️⃣ Confirmation email to the applicant
    await resend.emails.send({
      from: "JobHunters@barbags.co.uk",
      to: applicantEmail,
      subject: `Application submitted for ${jobTitle}`,
      html: `
        <p>Hi ${application.User.name || "there"},</p>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been submitted successfully.</p>
        <p>We will notify you if the company responds.</p>
        <p>Thank you for using JobHunters!</p>
      `,
    });

    // 4️⃣ Notification email to the company
    if (companyEmail) {
      await resend.emails.send({
        from: "JobHunters@barbags.co.uk",
        to: companyEmail,
        subject: `New applicant for ${jobTitle}`,
        html: `
          <p>Hello ${companyName},</p>
          <p>You have a new applicant for <strong>${jobTitle}</strong> on JobHunters.</p>
          <p>Applicant email: <strong>${applicantEmail}</strong></p>
          <p>Please check your dashboard for more details.</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



