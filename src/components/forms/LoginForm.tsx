import Image from "next/image";
// import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { auth, signIn } from "@/app/utils/auth";
import { GeneralSubmitButton } from "../general/SubmitButton";
import { redirect } from "next/navigation";

export async function LoginForm() {
  const session = await auth();

  if (session?.user) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome Back</CardTitle>
          <CardDescription>
            Login with your Google or GitHub account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <form
              action={async () => {
                "use server";

                await signIn("github", {
                  redirectTo: "/onboarding",
                });
              }}
            >
              <GeneralSubmitButton
                text="Login with GitHub"
                variant={"outline"}
                width="w-full"
                icon={
                  <>
                    <Image
                      src="/Github_light.svg"
                      alt="github logo"
                      width={14}
                      height={14}
                      className="block dark:hidden"
                    />
                    <Image
                      src="/Github_dark.svg"
                      alt="github logo"
                      width={14}
                      height={14}
                      className="hidden dark:block"
                    />
                  </>
                }
              />
            </form>
            <form
              action={async () => {
                "use server";

                await signIn("google", {
                  redirectTo: "/onboarding",
                });
              }}
            >
              <GeneralSubmitButton
                text="Login with Google"
                variant={"outline"}
                width="w-full"
                icon={
                  <Image
                    src="google.svg"
                    alt="google logo"
                    width={14}
                    height={14}
                  />
                }
              />
            </form>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-muted-foreground text-balance">
        <p>
          By clicking continue, you are agreeing to our terms,conditions and
          privacy policy.
        </p>
      </div>
    </div>
  );
}
