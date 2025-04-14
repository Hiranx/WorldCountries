"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        // Handle specific error messages
        if (result.error.includes("credentials")) {
          setError("INVALID EMAIL OR PASSWORD");
        } else {
          setError(result.error.toUpperCase());
        }
      } else {
        // Successful login - redirect to dashboard
        router.push("/dashboard");
        router.refresh(); // Ensure client state is updated
      }
    } catch (err: any) {
      setError("LOGIN FAILED. PLEASE TRY AGAIN.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 p-8 rounded-xl shadow-2xl border-2 border-gray-800 w-full max-w-md"
      >
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-impact text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-[#1ED760] tracking-tighter"
        >
          LOGIN
        </motion.h1>
  
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded mb-6 font-impact tracking-wider"
          >
            {error}
          </motion.div>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-gray-400 mb-3 font-impact tracking-wider">EMAIL</label>
            <motion.input
              whileFocus={{ borderColor: "#1ED760", scale: 1.02 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-impact focus:outline-none focus:border-[#1ED760]"
              required
            />
          </motion.div>
  
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-gray-400 mb-3 font-impact tracking-wider">PASSWORD</label>
            <motion.input
              whileFocus={{ borderColor: "#1ED760", scale: 1.02 }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-impact focus:outline-none focus:border-[#1ED760]"
              required
            />
          </motion.div>
  
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 15px rgba(30, 215, 96, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-[#1DB954] to-[#1ED760] text-white p-3 rounded-lg font-impact tracking-wider text-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                LOGGING IN...
              </motion.span>
            ) : (
              "LOGIN"
            )}
          </motion.button>
        </form>
  
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-gray-400 font-impact tracking-wider"
        >
          DON'T HAVE AN ACCOUNT?{" "}
          <Link href="/register">
            <motion.span
              whileHover={{ color: "#1ED760", scale: 1.05 }}
              className="text-[#1ED760] hover:underline cursor-pointer"
            >
              REGISTER
            </motion.span>
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}