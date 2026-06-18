import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

// POST /api/auth/login  (Public) -> returns a JWT token
export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user._id.toString(), name: user.name });

    return NextResponse.json({
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
