"use server"

import {z} from "zod";
import { requireUser } from "./requireUser";
import { companySchema, jobSeekerSchema } from "./zodSchema";
import {prisma} from "./db"
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./arcjet";
import { request } from "@arcjet/next";

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