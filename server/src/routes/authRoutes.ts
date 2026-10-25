
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { CookieOptions, Request, Response } from "express";
import { requireAdmin, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const passwordHash = process.env.ADMIN_PASSWORD_HASH;
const jwtSecret = process.env.JWT_SECRET;

if (!adminEmail || !passwordHash || !jwtSecret) {
  throw new Error("Admin authentication environment variables are missing.");
}

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 2 * 60 * 60 * 1000,
};

router.post("/login", async (req: Request, res: Response) => {
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  const password =
    typeof req.body?.password === "string"
      ? req.body.password
      : "";

  if (
    !email ||
    !password ||
    email.length > 254 ||
    password.length > 128
  ) {
    res.status(400).json({
      success: false,
      message: "Enter a valid email and password.",
    });
    return;
  }

  try {
    const passwordMatches = await bcrypt.compare(password, passwordHash);

    if (email !== adminEmail || !passwordMatches) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    const token = jwt.sign(
      { email: adminEmail, role: "admin" },
      jwtSecret,
      { expiresIn: "2h" },
    );

    res.cookie("portfolio_token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { email: adminEmail },
    });
  } catch (error) {
    console.error("Login failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to complete login.",
    });
  }
});

router.get("/me", requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: { email: req.admin!.email },
  });
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("portfolio_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

export default router;
