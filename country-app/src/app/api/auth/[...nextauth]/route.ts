import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const user = await User.findOne({ email: credentials.email.toLowerCase().trim() })
                               .select("+password");

          if (!user) {
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = await user.comparePassword(credentials.password.trim());
          
          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user"
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error instanceof Error ? error.message : "Authentication failed");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };