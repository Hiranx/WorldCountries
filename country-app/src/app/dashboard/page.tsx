"use client";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Welcome to Dashboard</h1>
        {session?.user && (
          <div className="space-y-2">
            <p>Name: {session.user.name}</p>
            <p>Email: {session.user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}