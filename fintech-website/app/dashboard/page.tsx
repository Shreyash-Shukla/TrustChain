import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard-client";

const jwt = require("jsonwebtoken");

export default async function DashboardPage() {
  const token = (await cookies()).get("trustchain_session")?.value;
  if (!token || !process.env.JWT_SECRET) redirect("/signin");

  try {
    jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    redirect("/signin");
  }

  return <Dashboard />;
}
