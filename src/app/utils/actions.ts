"use server"

import {z} from "zod";
import { requireUser } from "./requireUser";
import { companySchema, jobSchema, jobSeekerSchema } from "./zodSchema";
import {prisma} from "./db"
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./arcjet";
import { request } from "@arcjet/next";
import { stripe } from "./stripe";
import { jobListingDurationPricing } from "./jobListingPricing";
import { inngest } from "./inngest/client";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
    shield({
        mode: "LIVE",
    })
    
).withRule(
    detectBot({
        mode: "LIVE",
        allow: []
    })
)

export async function createCompany(data: z.infer<typeof companySchema>){
    const session = await requireUser();

    const req = await request()
    const decision = await aj.protect(req)

    if(decision.isDenied()){
        throw new Error("Forbidden")
    }

    const validateData = companySchema.parse(data);

    await prisma.user.update({
        where:{
            id: session.id,
        },
        data:{
            onboardingCompleted:true,
            userType:"COMPANY",
            Company:{
                create:{
                    ...validateData
                }
            }
        }
    })
    return redirect("/")
}

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>){
    const user = await requireUser();

        const req = await request()
    const decision = await aj.protect(req)

    if(decision.isDenied()){
        throw new Error("Forbidden")
    }

    const validateData = jobSeekerSchema.parse(data);

    await prisma.user.update({
        where:{
            id: user.id,
        },
        data:{
            onboardingCompleted:true,
            userType:"JOB_SEEKER",
            Jobseeker:{
                create:{
                    ...validateData
                }
            }
        }
    })
    return redirect("/")
}
 export async function createJob(data: z.infer<typeof jobSchema>){
      const user = await requireUser();
          const req = await request()
    const decision = await aj.protect(req)

    if(decision.isDenied()){
        throw new Error("Forbidden")
    }

       const validateData = jobSchema.parse(data);

       const company = await prisma.company.findUnique({
        where:{
            userId:user.id
        },
        select:{
            id:true,
            user:{
                select:{
                    stripeCustomerId:true
                }
            }
        }
       })
       if(!company?.id){
        return redirect("/")
       }

       let stripeCustomerId = company.user.stripeCustomerId;

       if(!stripeCustomerId){
        const customer = await stripe.customers.create({
            email: user.email as string,
            name: user.name as string,
        })
        stripeCustomerId = customer.id
        // update user 
        await prisma.user.update({
            where:{
                id: user.id,

            },
            data:{
                stripeCustomerId:customer.id,
            }
        })
       }

       const jobpost = await prisma.jobPost.create({
        data:{
            jobDescription: validateData.jobDescription,
            jobTitle:validateData.jobTitle,
            employmentType:validateData.employmentType,
            location:validateData.location,
            salaryFrom: validateData.salaryFrom,
            salaryTo:validateData.salaryTo,
            listingDuration:validateData.listingDuration,
            benefits:validateData.benefits,
            companyId:company.id,

            
        }, select:{
            id:true,
        }
       })

       const pricingTier = jobListingDurationPricing.find(
        (tier)=>tier.days === validateData.listingDuration
       )

       if(!pricingTier){
        throw new Error("Invalid Listing Duration selected")
       }
 // Trigger the job expiration function
       await inngest.send({
        name:"job/created",
        data:{
            jobId:jobpost.id,
            expirationDays: validateData.listingDuration,
        }
       })
       
       const session = await stripe.checkout.sessions.create({
        customer:stripeCustomerId,
        line_items: [
            {
                price_data:{
                    product_data:{
                        name: `Job Posting - ${pricingTier.days}`,
                        description:pricingTier.description,
                        images:[
                            "https://rk17buob4g.ufs.sh/f/XIhdSD3PpZWIRg4qcWCLGzwWDF7jT81IH0C69SihdExnRQMJ",
                        ],
                    },
                    currency: "GBP",
                    unit_amount: pricingTier.price * 100,
                    
                },
                quantity: 1,
            }
        ],
        metadata:{
            jobId: jobpost.id
        },
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
       })
       return redirect(session.url as string)
 }

 export async function saveJobPost(jobId:string){
     const user = await requireUser()
     const req = await request()
     const decision = await aj.protect(req)

     if(decision.isDenied()){
        throw new Error("Forbidden")
     }
     await prisma.savedJobPost.create({
        data:{
            jobPostId: jobId,
            userId:user.id as string
        }
     })
     revalidatePath(`/job/${jobId}`)
 }

  export async function unSaveJobPost(savedJobPostId:string){
     const user = await requireUser()
     const req = await request()
     const decision = await aj.protect(req)

     if(decision.isDenied()){
        throw new Error("Forbidden")
     }
     const data = await prisma.savedJobPost.delete({
        where:{
            id: savedJobPostId,
            userId: user.id
        },
        select:{
            jobPostId:true,
        }
     })
     revalidatePath(`/job/${data.jobPostId}`)
 }


export async function autocompleteCities(query: string) {
  if (!query || query.length < 2) return [];

  const results = await prisma.city.findMany({
    where: {
      city_ascii: {
        contains: query,
        mode: 'insensitive',
      },
    },
    select: {
      city: true,
      country: true,
      iso2: true,
    },
    orderBy: {
      population: 'desc',
    },
    take: 15,
  });

  // Format for frontend display
  return results.map(({ city, country, iso2 }) => ({
    label: `${city}, ${iso2 || country}`,
    city,
    country,
    iso2,
  }));
}
