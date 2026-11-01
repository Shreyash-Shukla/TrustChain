import connectDB from "@/db/db";
import User from "@/db/models/userSchema";
import bcrypt from "bcryptjs";

const json = (body, status) => Response.json(body, { status });

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return json({ error: "Invalid registration details" }, 400);
    }
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = body.password;
    const walletAddress = typeof body.walletAddress === "string"
      ? body.walletAddress.toLowerCase()
      : "";
    const imageUrl = body.image_url;

    if (!/^[a-zA-Z0-9_]{3,32}$/.test(username) ||
        typeof password !== "string" || password.length < 8 || password.length > 128 ||
        !/^0x[a-f0-9]{40}$/.test(walletAddress) ||
        typeof imageUrl !== "string" || !/^https:\/\//.test(imageUrl)) {
      return json({ error: "Invalid registration details" }, 400);
    }

    await connectDB();
    const existingUser = await User.findOne({ $or: [{ walletAddress }, { username }] });
    if (existingUser) {
      return json({ error: "Username or wallet already registered" }, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ walletAddress, username, password: hashedPassword, image_url: imageUrl });
    return json({ success: true, user: { walletAddress, username } }, 201);
  } catch (error) {
    if (error?.code === 11000) {
      return json({ error: "Username or wallet already registered" }, 409);
    }
    console.error("Sign up failed", error);
    return json({ error: "Unable to create account" }, 500);
  }
}
