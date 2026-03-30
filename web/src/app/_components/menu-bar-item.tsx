"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface MenuBarItemProps {
  href: string
  children: React.ReactNode
}

export function MenuBarItem({ children, href }: MenuBarItemProps) {
  const pathname = usePathname()
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`p-3 ${isActive ? "text-foreground" : "text-muted-foreground"}`}
    >
      {children}
    </Link>
  )
}
