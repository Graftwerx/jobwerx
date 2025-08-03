import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendJobApplicationEmail({
  to,
  companyName,
  jobTitle,
}: {
  to: string;
  companyName: string;
  jobTitle: string;
}) {
  return await resend.emails.send({
    from: "jobhunters@barbags.co.uk", // Must be verified
    to,
    subject: `Your application to ${companyName}`,
    html: `
      <h1>Application Submitted</h1>
      <p>You successfully applied to <strong>${jobTitle}</strong> at ${companyName}.</p>
      <p>We wish you the best of luck!</p>
    `,
  });
}
