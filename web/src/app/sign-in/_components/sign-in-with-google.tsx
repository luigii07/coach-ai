"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import Image from "next/image"

export function SignInWithGoogle() {
  function handleGoogleSignIn() {
    authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    })
  }

  return (
    <Button
      variant={"secondary"}
      onClick={handleGoogleSignIn}
      className="h-10 rounded-full px-6"
    >
      <Image
        src="/google-icon.svg"
        alt="Logo do Google"
        width={16}
        height={16}
        className="shrink-0"
      />
      Fazer login com Google
    </Button>
  )
}
