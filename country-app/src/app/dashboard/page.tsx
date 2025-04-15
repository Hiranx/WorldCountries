"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Favorite {
  country: string;
  flag: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/favorites?userId=${session.user.id}`);
          if (!response.ok) throw new Error("Failed to fetch favorites");
          const data = await response.json();
          setFavorites(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [status, session]);

  const handleUpdateProfile = async () => {
    setApiMessage("");
    setApiError("");

    if (newPassword && newPassword !== confirmPassword) {
      setApiError("New passwords don't match");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          currentPassword: newPassword ? currentPassword : undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setApiMessage("Profile updated successfully");
      setEditMode(false);
      // Refresh session to get updated data
      window.location.reload();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    setApiMessage("");
    setApiError("");

    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: deletePassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      // Sign out and redirect after successful deletion
      router.push("/logout");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to delete account");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-xl font-impact tracking-wider"
        >
          LOADING PROFILE...
        </motion.div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-xl font-impact tracking-wider text-center p-8"
        >
          <p>YOU NEED TO BE LOGGED IN TO VIEW THIS PAGE</p>
          <Link 
            href="/login" 
            className="text-[#1ED760] hover:underline mt-4 inline-block"
          >
            GO TO LOGIN PAGE
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6 mb-8 border-2 border-gray-800"
        >
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-impact text-[#1ED760] mb-6 tracking-tighter">
              USER PROFILE
            </h1>
            {!editMode && !deleteMode && (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-[#1ED760] rounded-lg font-impact tracking-wider"
                >
                  EDIT PROFILE
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteMode(true)}
                  className="px-4 py-2 bg-red-500 rounded-lg font-impact tracking-wider"
                >
                  DELETE ACCOUNT
                </motion.button>
              </div>
            )}
          </div>

          {editMode ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div>
                <label className="text-gray-400 font-impact tracking-wider block mb-1">
                  NAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-impact focus:outline-none focus:border-[#1ED760]"
                />
              </div>

              <div>
                <label className="text-gray-400 font-impact tracking-wider block mb-1">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-impact focus:outline-none focus:border-[#1ED760]"
                />
              </div>

              <div>
                <label className="text-gray-400 font-impact tracking-wider block mb-1">
                  NEW PASSWORD (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-impact focus:outline-none focus:border-[#1ED760]"
                />
              </div>

              {newPassword && (
                <>
                  <div>
                    <label className="text-gray-400 font-impact tracking-wider block mb-1">
                      CURRENT PASSWORD
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-impact focus:outline-none focus:border-[#1ED760]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 font-impact tracking-wider block mb-1">
                      CONFIRM NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-impact focus:outline-none focus:border-[#1ED760]"
                    />
                  </div>
                </>
              )}

              {apiMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-900/50 border border-green-700 text-green-400 px-4 py-3 rounded font-impact tracking-wider"
                >
                  {apiMessage}
                </motion.div>
              )}

              {apiError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded font-impact tracking-wider"
                >
                  {apiError}
                </motion.div>
              )}

              <div className="flex gap-2 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-[#1ED760] rounded-lg font-impact tracking-wider"
                >
                  SAVE CHANGES
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditMode(false);
                    setApiMessage("");
                    setApiError("");
                  }}
                  className="px-4 py-2 bg-gray-700 rounded-lg font-impact tracking-wider"
                >
                  CANCEL
                </motion.button>
              </div>
            </motion.div>
          ) : deleteMode ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="text-white font-impact tracking-wider">
                <p className="text-red-500 text-xl mb-4">
                  WARNING: THIS ACTION CANNOT BE UNDONE!
                </p>
                <p className="mb-4">
                  Deleting your account will permanently remove all your data, including your favorites.
                </p>
              </div>

              <div>
                <label className="text-gray-400 font-impact tracking-wider block mb-1">
                  ENTER YOUR PASSWORD TO CONFIRM
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-impact focus:outline-none focus:border-[#1ED760]"
                />
              </div>

              {apiError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded font-impact tracking-wider"
                >
                  {apiError}
                </motion.div>
              )}

              <div className="flex gap-2 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500 rounded-lg font-impact tracking-wider"
                >
                  CONFIRM DELETE
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setDeleteMode(false);
                    setApiError("");
                  }}
                  className="px-4 py-2 bg-gray-700 rounded-lg font-impact tracking-wider"
                >
                  CANCEL
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div>
                <p className="text-gray-400 font-impact tracking-wider">NAME</p>
                <p className="text-xl">{session.user.name}</p>
              </div>
              
              <div>
                <p className="text-gray-400 font-impact tracking-wider">EMAIL</p>
                <p className="text-xl">{session.user.email}</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900 rounded-xl p-6 border-2 border-gray-800"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-impact text-[#1ED760] tracking-tighter">
              FAVORITE COUNTRIES
            </h2>
            <p className="text-gray-400 font-impact tracking-wider">
              {favorites.length} {favorites.length === 1 ? "COUNTRY" : "COUNTRIES"}
            </p>
          </div>

          {error ? (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded mb-6 font-impact tracking-wider"
            >
              ERROR: {error}
            </motion.div>
          ) : favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center py-12 font-impact tracking-wider"
            >
              YOU HAVEN&apos;T SAVED ANY FAVORITES YET
              <p className="mt-2">
                <Link href="/" className="text-[#1ED760] hover:underline">
                  BROWSE COUNTRIES
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {favorites.map((favorite, index) => (
                <motion.div
                  key={`${favorite.country}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="group relative bg-gray-800 rounded-lg p-4 border-2 border-gray-700"
                >
                  <Link href={`/countries/${encodeURIComponent(favorite.country)}`}>
                    <div className="aspect-w-3 aspect-h-2 w-full overflow-hidden rounded-md mb-3">
                      <img
                        src={favorite.flag}
                        alt={`Flag of ${favorite.country}`}
                        className="h-28 w-full object-cover object-center group-hover:opacity-90 border border-gray-700"
                      />
                    </div>
                    <h3 className="text-md font-impact text-gray-100 text-center tracking-tight group-hover:text-[#1ED760]">
                    {decodeURIComponent(favorite.country).toUpperCase()}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}