import z from "zod";

export const companySchema = z.object({
    name: z.string().min(2, "Company name must have at least 2 characters."),
    location: z.string().min(1, "Location must be defined."),
    about: z.string().min(10,"Please provide some information about your company."),
    logo:z.string().min(1, "Please upload a logo."),
    website: z.url("Please enter a valid URL"),
    xAccount: z.string().optional(),
    
    

})

export const jobSeekerSchema = z.object({
    name: z.string().min(2,"Name must be at least 2 characters"),
    about: z.string().min(10,"Please provide more information about yourself"),
    resume: z.string().min(1,"Please upload your cv"),
})

export const jobSchema = z.object({
    jobTitle: z.string().min(2,"Job title needs to be at least 2 characters"),
    employmentType: z.string().min(1,"please select employment type"),
    location: z.string().min(1,"please select location"),
   
    salaryFrom: z.number().min(1,"salary from is required"),
     salaryTo: z.number().min(1,"salary to is required"),
     jobDescription: z.string().min(1,"job description is required"),
     listingDuration: z.number().min(1, "please specify duration"),
     benefits: z.array(z.string()).min(1,"please specify at least one benefit"),
     companyName: z.string().min(1,"Company name is required"),
     companyLocation: z.string().min(1, "company location is required"),
     companyAbout: z.string().min(12, "description required"),
     companyLogo: z.string().min(1,"logo is required"),
     companyWebsite: z.url().min(1,"please enter vaild URL"),
     companyXAccount: z.string().optional(),
    
     
})