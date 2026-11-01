"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function InvestmentAdvisor() {
  const [formData, setFormData] = useState({
    investmentCapital: "",
    riskTolerance: "Medium",
    timeHorizon: "1 year",
    investmentGoals: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  return (
    <div className="min-h-screen pt-20 hero-pattern">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              <span className="gradient-text">Investment</span> Planning Guide
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Explore illustrative allocations based on your selected risk level
            </p>
          </div>

          {!formSubmitted ? (
            <Card className="border-fintech-black-800 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Investment Profile</CardTitle>
                <CardDescription>Fill out the form below to receive tailored investment advice</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="investmentCapital">Investment Capital ($)</Label>
                    <Input
                      id="investmentCapital"
                      name="investmentCapital"
                      type="number"
                      placeholder="10000"
                      value={formData.investmentCapital}
                      onChange={handleChange}
                      required
                      className="bg-fintech-black-950/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                      <Select
                        value={formData.riskTolerance}
                        onValueChange={(value) => handleSelectChange("riskTolerance", value)}
                      >
                        <SelectTrigger id="riskTolerance" className="bg-fintech-black-950/50">
                          <SelectValue placeholder="Select risk tolerance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeHorizon">Investment Time Horizon</Label>
                      <Select
                        value={formData.timeHorizon}
                        onValueChange={(value) => handleSelectChange("timeHorizon", value)}
                      >
                        <SelectTrigger id="timeHorizon" className="bg-fintech-black-950/50">
                          <SelectValue placeholder="Select time horizon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6 months">6 months</SelectItem>
                          <SelectItem value="1 year">1 year</SelectItem>
                          <SelectItem value="2 years">2 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investmentGoals">Investment Goals</Label>
                    <Textarea
                      id="investmentGoals"
                      name="investmentGoals"
                      placeholder="Describe your investment goals (e.g., retirement, buying a house, education)"
                      value={formData.investmentGoals}
                      onChange={handleChange}
                      required
                      className="min-h-[100px] bg-fintech-black-950/50"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    See Example Allocations
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-fintech-black-800 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Example Allocations</CardTitle>
                <CardDescription>
                  Based on your profile: ${formData.investmentCapital} investment, {formData.riskTolerance} risk
                  tolerance, {formData.timeHorizon} time horizon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="recommendations" className="w-full">
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="recommendations">Examples</TabsTrigger>
                  </TabsList>
                  <TabsContent value="recommendations" className="mt-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Asset Allocation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {formData.riskTolerance === "High" ? (
                            <>
                              <Card className="bg-fintech-black-900">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">Stocks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-3xl font-bold text-primary">70%</p>
                                  <p className="text-sm text-muted-foreground">High growth potential</p>
                                </CardContent>
                              </Card>
                              <Card className="bg-fintech-black-900">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">Bonds</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-3xl font-bold text-primary">20%</p>
                                  <p className="text-sm text-muted-foreground">Stability & income</p>
                                </CardContent>
                              </Card>
                              <Card className="bg-fintech-black-900">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">Alternatives</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-3xl font-bold text-primary">10%</p>
                                  <p className="text-sm text-muted-foreground">Diversification</p>
                                </CardContent>
                              </Card>
                            </>
                          ) : formData.riskTolerance === "Medium" ? (
                            <>
                              <Card className="bg-fintech-black-900">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">Stocks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-3xl font-bold text-primary">50%</p>
                                  <p className="text-sm text-muted-foreground">Balanced growth</p>
                                </CardContent>
                              </Card>
                              <Card className="bg-fintech-black-900">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">Bonds</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-3xl font-bold text-primary">40%</p>
                                  <p className="text-sm text-muted-foreground">Income & stability</p>
                                </CardContent>
                              </Card>
                              <Card className="bg-fintech-black-900">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">Cash</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-3xl font-bold text-primary">10%</p>
                                  <p className="text-sm text-muted-foreground">Liquidity</p>
                                </CardContent>
                              </Card>
                            </>
                          ) : (
                            <>
                              <Card className="bg-fintech-black-900">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">Stocks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-3xl font-bold text-primary">30%</p>
                                  <p className="text-sm text-muted-foreground">Conservative growth</p>
                                </CardContent>
                              </Card>
                              <Card className="bg-fintech-black-900">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">Bonds</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-3xl font-bold text-primary">50%</p>
                                  <p className="text-sm text-muted-foreground">Stability & income</p>
                                </CardContent>
                              </Card>
                              <Card className="bg-fintech-black-900">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">Cash</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-3xl font-bold text-primary">20%</p>
                                  <p className="text-sm text-muted-foreground">Safety & liquidity</p>
                                </CardContent>
                              </Card>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Recommended Investment Vehicles</h3>
                        <ul className="space-y-2">
                          {formData.riskTolerance === "High" ? (
                            <>
                              <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full p-1 mr-2">•</span>
                                <span>Growth-oriented ETFs (e.g., VUG, QQQ, VGT)</span>
                              </li>
                              <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full p-1 mr-2">•</span>
                                <span>Individual growth stocks in technology and emerging sectors</span>
                              </li>
                              <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full p-1 mr-2">•</span>
                                <span>Small allocation to cryptocurrency (5-10% maximum)</span>
                              </li>
                            </>
                          ) : formData.riskTolerance === "Medium" ? (
                            <>
                              <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full p-1 mr-2">•</span>
                                <span>Balanced ETFs (e.g., AOR, VBIAX)</span>
                              </li>
                              <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full p-1 mr-2">•</span>
                                <span>Blue-chip dividend stocks</span>
                              </li>
                              <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full p-1 mr-2">•</span>
                                <span>Investment-grade corporate bonds</span>
                              </li>
                            </>
                          ) : (
                            <>
                              <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full p-1 mr-2">•</span>
                                <span>Conservative ETFs (e.g., AOK, VCSH)</span>
                              </li>
                              <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full p-1 mr-2">•</span>
                                <span>Treasury bonds and high-quality corporate bonds</span>
                              </li>
                              <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full p-1 mr-2">•</span>
                                <span>High-yield savings accounts for cash portion</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>

                      <Button onClick={() => setFormSubmitted(false)} variant="outline">
                        Update Your Profile
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

