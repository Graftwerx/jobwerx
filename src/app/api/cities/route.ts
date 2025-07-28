// app/api/cities/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || query.length < 2) return NextResponse.json([]);

  const results = await prisma.city.findMany({
    where: {
      city_ascii: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      city: true,
      country: true,
      iso2: true,
    },
    take: 10,
    orderBy: { population: "desc" },
  });

 return NextResponse.json(
  results.map(({ id, city, country, iso2 }) => ({
    id: id.toString(),
    city,
    country,
    iso2,
    label: `${city}, ${iso2 || country}`,
  }))
);

}
