import connectDB from "@/db/db";
import User from "@/db/models/userSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "trustchain_session";

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const { username, password, walletAddress } = body;
    if (typeof username !== "string" || typeof password !== "string" ||
        typeof walletAddress !== "string") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET must contain at least 32 characters");
    }

    await connectDB();
    const user = await User.findOne({ username: username.trim() });
    const walletMatches = user?.walletAddress?.toLowerCase() === walletAddress.toLowerCase();
    const isHashed = user?.password?.startsWith("$2");
    const passwordMatches = user && (isHashed
      ? await bcrypt.compare(password, user.password)
      : password === user.password);

    if (!user || !walletMatches || !passwordMatches) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Upgrade accounts created before passwords were hashed.
    if (!isHashed) {
      user.password = await bcrypt.hash(password, 12);
      await user.save();
    }

    const token = jwt.sign(
      { userId: String(user._id), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const response = NextResponse.json({
      success: true,
      user: { username: user.username, walletAddress: user.walletAddress }
    });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });
    return response;
  } catch (error) {
    console.error("Sign in failed", error);
    return NextResponse.json({ error: "Unable to sign in" }, { status: 500 });
  }
}
