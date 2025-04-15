"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black p-4 border-b-2 border-gray-800"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-impact tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-[#0a5c36]"
          >
            WORLD COUNTRIES
          </motion.div>
        </Link>
        
        <div className="flex space-x-6">
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard">
                <motion.span
                  whileHover={{ 
                    color: "#1DB954",
                    scale: 1.05,
                    textShadow: "0 0 8px rgba(29, 185, 84, 0.5)"
                  }}
                  className="font-impact tracking-wider text-gray-300"
                >
                  {session?.user?.name || "PROFILE"}
                </motion.span>
              </Link>
              <motion.button 
                onClick={() => signOut()}
                whileHover={{ 
                  color: "#f87171",
                  scale: 1.05,
                  textShadow: "0 0 8px rgba(248, 113, 113, 0.5)"
                }}
                className="font-impact tracking-wider text-gray-300"
              >
                LOGOUT
              </motion.button>
            </>
          ) : (
            <>
              <Link href="/login">
                <motion.span
                  whileHover={{ 
                    color: "#1DB954",
                    scale: 1.05,
                    textShadow: "0 0 8px rgba(29, 185, 84, 0.5)"
                  }}
                  className="font-impact tracking-wider text-gray-300"
                >
                  LOGIN
                </motion.span>
              </Link>
              <Link href="/register">
                <motion.span
                  whileHover={{ 
                    color: "#1DB954",
                    scale: 1.05,
                    textShadow: "0 0 8px rgba(29, 185, 84, 0.5)"
                  }}
                  className="font-impact tracking-wider text-gray-300"
                >
                  REGISTER
                </motion.span>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}