import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { AUTH_COOKIE_NAME, signAuthToken } from "@/lib/jwt";
import { getAuthUser } from "@/middleware/auth";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(6, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

function publicUser(user: any) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function registerHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = parsed.data;

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const user = await User.create({ name, email, phone, password, role: "patient" });

    const token = signAuthToken({ userId: String(user._id), role: user.role });

    const res = NextResponse.json({ user: publicUser(user) }, { status: 201 });
    res.cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);
    return res;
  } catch (err) {
    console.error("registerHandler error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function loginHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    await connectDB();

    const user = await User.findOne({ email }).select("+password");

    const invalidCredentials = () =>
      NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    if (!user) return invalidCredentials();

    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) return invalidCredentials();

    const token = signAuthToken({ userId: String(user._id), role: (user as any).role });

    const res = NextResponse.json({ user: publicUser(user) }, { status: 200 });
    res.cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);
    return res;
  } catch (err) {
    console.error("loginHandler error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function meHandler(req: NextRequest) {
  try {
    const authPayload = getAuthUser(req);
    if (!authPayload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectDB();
    const user = await User.findById(authPayload.userId);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user: publicUser(user) }, { status: 200 });
  } catch (err) {
    console.error("meHandler error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function logoutHandler() {
  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set(AUTH_COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 });
  return res;
}
