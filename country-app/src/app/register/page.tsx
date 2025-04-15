"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("ALL FIELDS ARE REQUIRED");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "REGISTRATION FAILED");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("SOMETHING WENT WRONG");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 p-8 rounded-xl shadow-2xl border-2 border-gray-800 w-full max-w-md"
      >
        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-3xl font-impact text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-[#1ED760] tracking-tighter"
        >
          REGISTER
        </motion.h1>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-6 text-center font-impact tracking-wider"
          >
            {error}
          </motion.p>
        )}
  
        <form onSubmit={handleSubmit}>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <label className="block text-gray-400 mb-3 font-impact tracking-wider">NAME</label>
            <motion.input
              whileFocus={{ borderColor: "#1ED760", scale: 1.02 }}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-impact focus:outline-none focus:border-[#1ED760]"
              required
            />
          </motion.div>
  
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
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
            transition={{ delay: 0.3 }}
            className="mb-8"
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
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 15px rgba(30, 215, 96, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-[#1DB954] to-[#1ED760] text-white p-3 rounded-lg font-impact tracking-wider text-lg"
          >
            CREATE ACCOUNT
          </motion.button>
        </form>
  
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-gray-400 font-impact tracking-wider"
        >
          ALREADY HAVE AN ACCOUNT?{" "}
          <motion.a
            whileHover={{ color: "#1ED760", scale: 1.05 }}
            href="/login"
            className="text-[#1ED760] hover:underline"
          >
            LOGIN
          </motion.a>
        </motion.p>
      </motion.div>
    </div>
  );
}