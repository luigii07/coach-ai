import { MenuBar } from "../../_components/menu-bar"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      {children}
      <MenuBar />
    </div>
  )
}
