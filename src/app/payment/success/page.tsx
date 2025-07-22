import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PaymentSucces() {
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center rounded-lg">
            <Check className="size-12 p-2 rounded-full bg-green-500/30 text-green-500" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Successful</h2>
            <p className="mt-2 text-sm text-muted-foreground tracking-tight text-balance">
              Your job posting is now active
            </p>
            <Button asChild className="mt-5 w-full">
              <Link href={"/"}>Homepage</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
