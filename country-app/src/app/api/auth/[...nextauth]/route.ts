import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Validate input
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const email = credentials.email.toLowerCase().trim();
          const password = credentials.password.trim();

          await dbConnect();
          
          // Find user with password
          const user = await User.findOne({ email }).select("+password");
          if (!user) {
            console.log("User not found for email:", email);
            throw new Error("Invalid credentials");
          }

          // Direct comparison with error handling
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            console.log("Password mismatch for user:", email);
            console.log("Input password:", password);
            console.log("Stored hash:", user.password);
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user"
          };
        } catch (error: any) {
          console.error("Authentication error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
};


  
  const handler = NextAuth(authOptions);
  export { handler as GET, handler as POST };