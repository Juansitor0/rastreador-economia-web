import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./database.js";
import { JWTPayload, AuthResponse } from "../types.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRY = "7d";

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(userId: string, email: string): string {
    const payload: JWTPayload = {
      userId,
      email,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static async register(name: string, email: string, password: string): Promise<AuthResponse | { error: string }> {
    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return { error: "Email já cadastrado" };
    }

    // Hash password
    const password_hash = await this.hashPassword(password);

    // Create user
    const user = await db.createUser(name, email, password_hash);

    // Create financial profile for the user
    await db.createFinancialProfile(user.id, {});

    // Generate token
    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  static async login(email: string, password: string): Promise<AuthResponse | { error: string }> {
    // Find user by email
    const user = await db.getUserByEmail(email);
    if (!user) {
      return { error: "Usuário ou senha incorretos" };
    }

    // Compare password
    const isPasswordValid = await this.comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return { error: "Usuário ou senha incorretos" };
    }

    // Generate token
    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
