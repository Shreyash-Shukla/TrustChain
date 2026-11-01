"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { motion } from "framer-motion"
import {
  BarChart3,
  Bell,
  CreditCard,
  DollarSign,
  Download,
  Menu,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts"

// Sample data for charts
const balanceData = [
  { name: "Jan", balance: 5000 },
  { name: "Feb", balance: 7500 },
  { name: "Mar", balance: 6800 },
  { name: "Apr", balance: 9000 },
  { name: "May", balance: 10500 },
  { name: "Jun", balance: 11000 },
  { name: "Jul", balance: 12500 },
]

const transactionData = [
  { name: "Jan", income: 8500, expenses: 6500 },
  { name: "Feb", income: 9200, expenses: 5800 },
  { name: "Mar", income: 8700, expenses: 7100 },
  { name: "Apr", income: 9500, expenses: 6900 },
  { name: "May", income: 10200, expenses: 7200 },
  { name: "Jun", income: 11500, expenses: 7800 },
  { name: "Jul", income: 12000, expenses: 8100 },
]

const investmentData = [
  { name: "Stocks", value: 45 },
  { name: "Bonds", value: 20 },
  { name: "Real Estate", value: 15 },
  { name: "Crypto", value: 10 },
  { name: "Cash", value: 10 },
]

const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]

const recentTransactions = [
  {
    id: "1",
    name: "Amazon",
    date: "Today, 2:45 PM",
    amount: -89.99,
    status: "completed",
    type: "expense",
  },
  {
    id: "2",
    name: "Salary Deposit",
    date: "Yesterday, 9:00 AM",
    amount: 4750.0,
    status: "completed",
    type: "income",
  },
  {
    id: "3",
    name: "Spotify",
    date: "Jul 28, 2023",
    amount: -12.99,
    status: "completed",
    type: "expense",
  },
  {
    id: "4",
    name: "Transfer to Savings",
    date: "Jul 27, 2023",
    amount: -500.0,
    status: "completed",
    type: "transfer",
  },
  {
    id: "5",
    name: "Freelance Payment",
    date: "Jul 25, 2023",
    amount: 950.0,
    status: "completed",
    type: "income",
  },
]

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 md:ml-64">
        <main className="grid gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$12,500.00</div>
                      <p className="text-xs text-muted-foreground">+15% from last month</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Income</CardTitle>
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$8,250.00</div>
                      <p className="text-xs text-muted-foreground">+4.3% from last month</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                      <TrendingDown className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$5,750.00</div>
                      <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">7</div>
                      <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Balance Overview</CardTitle>
                    <CardDescription>Your balance trend over the last 7 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        balance: {
                          label: "Balance",
                          color: "hsl(var(--primary))",
                        },
                      }}
                      className="aspect-[4/3]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={balanceData}>
                          <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="var(--color-balance)"
                            fillOpacity={1}
                            fill="url(#colorBalance)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Portfolio Allocation</CardTitle>
                    <CardDescription>Your current investment distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[4/3] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={investmentData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {investmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Income vs Expenses</CardTitle>
                    <CardDescription>Your financial flow over the last 7 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        income: {
                          label: "Income",
                          color: "hsl(var(--primary))",
                        },
                        expenses: {
                          label: "Expenses",
                          color: "hsl(var(--destructive))",
                        },
                      }}
                      className="aspect-[4/3]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={transactionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="income" fill="var(--color-income)" />
                          <Bar dataKey="expenses" fill="var(--color-expenses)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest financial activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between space-x-4">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`rounded-full p-2 ${
                                transaction.type === "income"
                                  ? "bg-emerald-500/20 text-emerald-500"
                                  : transaction.type === "expense"
                                    ? "bg-rose-500/20 text-rose-500"
                                    : "bg-blue-500/20 text-blue-500"
                              }`}
                            >
                              {transaction.type === "income" ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : transaction.type === "expense" ? (
                                <TrendingDown className="h-4 w-4" />
                              ) : (
                                <CreditCard className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium leading-none">{transaction.name}</p>
                              <p className="text-xs text-muted-foreground">{transaction.date}</p>
                            </div>
                          </div>
                          <div
                            className={`text-sm font-medium ${
                              transaction.amount > 0 ? "text-emerald-500" : "text-rose-500"
                            }`}
                          >
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Link href="/dashboard/transactions">
                        <Button variant="outline" size="sm">
                          View All Transactions
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>Detailed analysis of your financial data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={transactionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription>Generate and download your financial reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Monthly Statement</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">
                          Your monthly financial summary with all transactions.
                        </p>
                      </CardContent>
                      <div className="px-6 pb-4">
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Tax Report</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">
                          Annual tax report with all relevant financial information.
                        </p>
                      </CardContent>
                      <div className="px-6 pb-4">
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Investment Report</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">
                          Detailed analysis of your investment portfolio performance.
                        </p>
                      </CardContent>
                      <div className="px-6 pb-4">
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Stay updated with your account activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 rounded-lg border border-fintech-black-800 p-4">
                      <Bell className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">New Transaction Alert</p>
                        <p className="text-sm text-muted-foreground">A new transaction of $89.99 was made to Amazon.</p>
                        <p className="mt-1 text-xs text-muted-foreground">Today, 2:45 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 rounded-lg border border-fintech-black-800 p-4">
                      <Users className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Account Security</p>
                        <p className="text-sm text-muted-foreground">Your account password was changed successfully.</p>
                        <p className="mt-1 text-xs text-muted-foreground">Yesterday, 10:30 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 rounded-lg border border-fintech-black-800 p-4">
                      <TrendingUp className="mt-0.5 h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="font-medium">Investment Update</p>
                        <p className="text-sm text-muted-foreground">Your investment in AAPL has increased by 5.2%.</p>
                        <p className="mt-1 text-xs text-muted-foreground">Jul 28, 2023</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
