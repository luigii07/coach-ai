import Image from "next/image"
import { SignInWithGoogle } from "./_components/sign-in-with-google"

export default function Page() {
  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <Image
          src="/login-bg.png"
          alt="background image"
          className="object-cover"
          fill
        />
      </div>

      <div className="relative z-10 flex justify-center pt-12">
        <h1 className="font-anton text-3xl tracking-wide text-primary-foreground uppercase">
          Coach AI
        </h1>
      </div>

      <div className="flex-1" />

      <div className="relative z-10 flex flex-col items-center gap-15 rounded-t-2xl bg-primary px-5 pt-12 pb-10">
        <div className="flex w-full flex-col items-center gap-6">
          <h1 className="w-full text-center font-heading text-3xl font-semibold text-primary-foreground">
            O app que vai transformar a forma como você treina.
          </h1>

          <SignInWithGoogle />
        </div>

        <p className="font-heading text-xs leading-[1.4] text-primary-foreground/75">
          ©2026 Copyright COACH.AI Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}
