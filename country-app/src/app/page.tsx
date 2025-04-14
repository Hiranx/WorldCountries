"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  region?: string;
  languages?: {
    [key: string]: string;
  };
}

export default function DashboardPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const router = useRouter();

  const handleFlagClick = (countryName: string) => {
    router.push(`/countries/${encodeURIComponent(countryName)}`);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,region,languages"
        );
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    let results = [...countries];
    if (searchTerm) {
      results = results.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (regionFilter) {
      results = results.filter(country =>
        country.region?.toLowerCase() === regionFilter.toLowerCase()
      );
    }
    if (languageFilter) {
      results = results.filter(country =>
        country.languages &&
        Object.values(country.languages).some(lang =>
          lang.toLowerCase().includes(languageFilter.toLowerCase())
      ));
    }
    setFilteredCountries(results);
  }, [searchTerm, regionFilter, languageFilter, countries]);

  const uniqueRegions = [...new Set(countries.map(country => country.region).filter((region): region is string => !!region))];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-xl font-impact tracking-wider"
        >
          LOADING COUNTRIES...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-red-500 text-xl font-impact tracking-wider"
        >
          ERROR: {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-impact text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-[#1DB954] tracking-tighter"
        >
          ALL COUNTRIES
        </motion.h1>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div whileHover={{ scale: 1.02 }}>
            <input
              type="text"
              placeholder="SEARCH BY NAME"
              className="w-full p-3 rounded bg-gray-900 text-white border-2 border-gray-800 focus:border-cyan-400 focus:outline-none font-impact tracking-wider placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }}>
            <select
              className="w-full p-3 rounded bg-gray-900 text-white border-2 border-gray-800 focus:border-cyan-400 focus:outline-none font-impact tracking-wider appearance-none"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="">FILTER BY REGION</option>
              {uniqueRegions.map(region => (
                <option key={region} value={region}>{region.toUpperCase()}</option>
              ))}
            </select>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }}>
            <input
              type="text"
              placeholder="FILTER BY LANGUAGE"
              className="w-full p-3 rounded bg-gray-900 text-white border-2 border-gray-800 focus:border-cyan-400 focus:outline-none font-impact tracking-wider placeholder-gray-500"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 mb-6 font-impact tracking-wider text-center"
        >
          DISPLAYING {filteredCountries.length} OF {countries.length} COUNTRIES
        </motion.div>

        {/* Countries Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8"
        >
          {filteredCountries.map((country) => (
            <motion.div
              key={country.name.common}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{
                y: -10,
                boxShadow: "0 10px 25px -5px rgba(30, 215, 96, 0.5)",
                borderColor: "#1ED760",
              }}
              className="group relative bg-gray-900 rounded-lg p-4 border-2 border-gray-800 cursor-pointer hover:border-[#1ED760] transition-colors duration-300"
              onClick={() => handleFlagClick(country.name.common)}
            >
              <div className="aspect-w-3 aspect-h-2 w-full overflow-hidden rounded-md mb-3">
                <motion.img
                  src={country.flags.png}
                  alt={country.flags.alt || `Flag of ${country.name.common}`}
                  className="h-28 w-full object-cover object-center group-hover:opacity-90 border border-gray-800"
                  whileHover={{ scale: 1.05 }}
                />
              </div>
              <motion.h3 
                className="text-md font-impact text-gray-100 text-center tracking-tight"
                whileHover={{ color: "#1ED760" }}
              >
                {country.name.common.toUpperCase()}
              </motion.h3>
              <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-[#1ED760] pointer-events-none transition-all duration-300"></div>
            </motion.div>
          ))}
        </motion.div>

        {filteredCountries.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-12 font-impact tracking-wider text-xl"
          >
            NO COUNTRIES MATCH YOUR SEARCH
          </motion.div>
        )}
      </div>
    </div>
  );
}