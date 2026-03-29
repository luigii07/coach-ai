import { authClient } from "@/lib/auth-client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Layout({
  children,
}: {
  children: Readonly<{ children: React.ReactNode }>
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  if (!session) redirect("/sign-in")

  return <>{children}</>
}
