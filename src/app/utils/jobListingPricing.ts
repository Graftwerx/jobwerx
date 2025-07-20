

interface iAppProps {
    days: number;
    price: number;
    description: string;
}

export const jobListingDurationPricing: iAppProps[] = [
    {
        days: 30,
        price: 99,
        description: "Standard"
    },
    {
        days: 60,
        price: 179,
        description: "Pro"
    },
    {
        days: 90,
        price: 249,
        description: "Pro-Max"
    }
]