import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiChatVoiceFill, RiMicrosoftLine } from "@remixicon/react";
import { ModeToggle } from "@/components/toogle-mode";
import { signIn, auth } from "@/auth.js";

export default async function Page() {
  const session = await auth();
  return (
    <div className="w-full h-screen lg:min-h-[600px]  xl:min-h-[800px]">
      <div className="float-right p-5">
        <ModeToggle />
      </div>
      <div className="flex items-center h-full justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6 space-y-4">
          <h5 className="flex gap-3 font-bold">
            <RiChatVoiceFill /> Ok2a
          </h5>
          <div className="grid gap-1 text-left">
            <h1 className="text-2xl font-bold">Sign in to your account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          {/* {Object.values(providerMap).map((provider) => ( */}
          <form
            action={async () => {
              "use server";
              await signIn("azure-ad", { redirectTo: "/chat" });
            }}
          >
            <Button type="submit" className="w-full flex items-center gap-3">
              <RiMicrosoftLine /> Login with Microsoft
            </Button>
          </form>
          {/* ))} */}
        </div>
      </div>
    </div>
  );
}
