"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, CreditCard, DollarSign, Home, PieChart, Settings, User, Wallet, LogOut } from "lucide-react"

interface SidebarProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export function DashboardSidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" })
    router.replace("/signin")
    router.refresh()
  }

  const routes = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "Transactions",
      href: "/dashboard/transactions",
      icon: CreditCard,
    },
    {
      name: "Investments",
      href: "/dashboard/investments",
      icon: PieChart,
    },
    {
      name: "Payments",
      href: "/dashboard/payments",
      icon: DollarSign,
    },
    {
      name: "Wallets",
      href: "/dashboard/wallets",
      icon: Wallet,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r border-fintech-black-800 bg-fintech-black-950 transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex h-16 items-center justify-between border-b border-fintech-black-800 px-4">
       
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <span className="sr-only">Close sidebar</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-fintech-black-900 ${
                pathname === route.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              <route.icon className="h-4 w-4" />
              {route.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-fintech-black-800 p-4">
        <div className="flex items-center gap-4">
          <img src="/placeholder.svg?height=40&width=40" alt="User" className="h-10 w-10 rounded-full" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium">John Doe</p>
            <p className="truncate text-xs text-muted-foreground">john.doe@example.com</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}

