"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountryDetails {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  languages?: {
    [key: string]: string;
  };
  currencies?: {
    [key: string]: {
      name: string;
      symbol?: string;
    };
  };
  borders?: string[];
  area?: number;
  tld?: string[];
  cca2?: string;
  cca3?: string;
  ccn3?: string;
  cioc?: string;
  independent?: boolean;
  status?: string;
  unMember?: boolean;
  idd?: {
    root?: string;
    suffixes?: string[];
  };
  capitalInfo?: {
    latlng?: [number, number];
  };
  latlng?: [number, number];
  timezones?: string[];
  continents?: string[];
  startOfWeek?: string;
  car?: {
    signs?: string[];
    side?: string;
  };
  postalCode?: {
    format?: string;
    regex?: string;
  };
  gini?: {
    [key: string]: number;
  };
  demonyms?: {
    [key: string]: {
      f: string;
      m: string;
    };
  };
  coatOfArms?: {
    png?: string;
    svg?: string;
  };
}

export default function CountryDetailPage() {
  const params = useParams();
  const countryName = params?.name as string;
  const [country, setCountry] = useState<CountryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [neighbors, setNeighbors] = useState<CountryDetails[]>([]);
  const [subregionCountries, setSubregionCountries] = useState<CountryDetails[]>([]);
  const [currencyCountries, setCurrencyCountries] = useState<CountryDetails[]>([]);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        if (!countryName) return;
        
        // API 1: Get country by name (primary data)
        const countryResponse = await fetch(
          `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
        );
        if (!countryResponse.ok) throw new Error("Country not found");
        const countryData = await countryResponse.json();
        const mainCountry = countryData[0];
        setCountry(mainCountry);

        // API 2: Get countries using the same currency
        if (mainCountry.currencies) {
          const currencyCode = Object.keys(mainCountry.currencies)[0];
          const currencyResponse = await fetch(
            `https://restcountries.com/v3.1/currency/${currencyCode}`
          );
          if (currencyResponse.ok) {
            const currencyData = await currencyResponse.json();
            setCurrencyCountries(
              currencyData.filter((c: CountryDetails) => c.cca3 !== mainCountry.cca3)
            );
          }
        }

        // API 3: Get countries in the same subregion
        if (mainCountry.subregion) {
          const subregionResponse = await fetch(
            `https://restcountries.com/v3.1/subregion/${mainCountry.subregion}`
          );
          if (subregionResponse.ok) {
            const subregionData = await subregionResponse.json();
            setSubregionCountries(
              subregionData.filter((c: CountryDetails) => c.cca3 !== mainCountry.cca3)
            );
          }
        }

        // API 4: Get neighboring countries by codes
        if (mainCountry.borders && mainCountry.borders.length > 0) {
          const neighborsResponse = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${mainCountry.borders.join(',')}`
          );
          if (neighborsResponse.ok) {
            const neighborsData = await neighborsResponse.json();
            setNeighbors(neighborsData);
          }
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [countryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-xl font-impact tracking-wider"
        >
          LOADING COUNTRY DATA...
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

  if (!country) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-white text-xl font-impact tracking-wider"
        >
          COUNTRY DATA NOT AVAILABLE
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8 items-start"
        >
          {/* Flag Section */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 rounded-xl p-6 shadow-2xl border-2 border-gray-800"
          >
            <motion.img
              src={country.flags.png}
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              className="w-full h-auto max-h-80 object-contain rounded-lg border-2 border-gray-800"
              whileHover={{ scale: 1.03 }}
            />
            {country.coatOfArms?.png && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <h3 className="text-lg font-impact text-gray-300 mb-3 tracking-wider">COAT OF ARMS</h3>
                <motion.img
                  src={country.coatOfArms.png}
                  alt={`Coat of Arms of ${country.name.common}`}
                  className="h-24 w-auto object-contain mx-auto border-2 border-gray-800 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                />
              </motion.div>
            )}
          </motion.div>
  
          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-xl p-6 shadow-2xl border-2 border-gray-800"
          >
            <motion.h1 
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              className="text-4xl font-impact mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-[#0a5c36] tracking-tighter"
            >
              {country.name.common.toUpperCase()}
            </motion.h1>
            <motion.h2 
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-impact text-gray-300 mb-8 tracking-wider"
            >
              {country.name.official.toUpperCase()}
            </motion.h2>
  
            {/* Countries with Same Currency */}
            {currencyCountries.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h3 className="text-lg font-impact text-gray-300 mb-3 tracking-wider">
                  COUNTRIES USING {Object.values(country.currencies || {})[0]?.name?.toUpperCase()}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currencyCountries.slice(0, 10).map((currencyCountry) => (
                    <motion.span 
                      key={currencyCountry.cca3}
                      whileHover={{ scale: 1.1, backgroundColor: "#1ED760" }}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm font-impact tracking-wider"
                    >
                      {currencyCountry.name.common.toUpperCase()}
                    </motion.span>
                  ))}
                  {currencyCountries.length > 10 && (
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm font-impact tracking-wider"
                    >
                      +{currencyCountries.length - 10} MORE
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-impact text-[#1ED760] tracking-tighter">BASIC INFORMATION</h2>
                <DetailItem label="CAPITAL" value={country.capital?.join(", ")} />
                <DetailItem label="REGION" value={country.region} />
                <DetailItem label="SUBREGION" value={country.subregion} />
                <DetailItem label="CONTINENT" value={country.continents?.join(", ")} />
                <DetailItem 
                  label="POPULATION" 
                  value={country.population ? country.population.toLocaleString() : undefined} 
                />
                <DetailItem 
                  label="AREA (KM²)" 
                  value={country.area ? country.area.toLocaleString() : undefined} 
                />
                <DetailItem label="COUNTRY CODE" value={country.cca3} />
                <DetailItem label="TOP-LEVEL DOMAIN" value={country.tld?.join(", ")} />
                <DetailItem label="UN MEMBER" value={country.unMember ? "YES" : "NO"} />
                <DetailItem label="INDEPENDENT" value={country.independent ? "YES" : "NO"} />
              </motion.div>
  
              {/* Advanced Information */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-impact text-[#1ED760] tracking-tighter">ADDITIONAL DETAILS</h2>
                
                {country.languages && (
                  <DetailItem
                    label="LANGUAGES"
                    value={Object.entries(country.languages)
                      .map(([code, name]) => `${name.toUpperCase()} (${code.toUpperCase()})`)
                      .join(", ")}
                  />
                )}
                
                {country.currencies && (
                  <DetailItem
                    label="CURRENCIES"
                    value={Object.entries(country.currencies)
                      .map(([code, currency]) => `${currency.name.toUpperCase()} (${currency.symbol || code.toUpperCase()})`)
                      .join(", ")}
                  />
                )}
  
                {country.demonyms && (
                  <DetailItem
                    label="DEMONYMS"
                    value={Object.entries(country.demonyms)
                      .map(([gender, demonym]) => `${demonym.m.toUpperCase()} (MALE), ${demonym.f.toUpperCase()} (FEMALE)`)
                      .join("; ")}
                  />
                )}
  
                {country.idd && (
                  <DetailItem
                    label="CALLING CODE"
                    value={country.idd.suffixes?.map(suffix => `${country.idd?.root}${suffix}`).join(", ")}
                  />
                )}
  
                <DetailItem label="TIMEZONES" value={country.timezones?.join(", ").toUpperCase()} />
                <DetailItem label="START OF WEEK" value={country.startOfWeek?.toUpperCase()} />
                
                {country.car && (
                  <DetailItem
                    label="DRIVING"
                    value={`SIDE: ${country.car.side?.toUpperCase()}, SIGNS: ${country.car.signs?.join(", ").toUpperCase()}`}
                  />
                )}
  
                {country.postalCode && (
                  <DetailItem
                    label="POSTAL CODE"
                    value={`FORMAT: ${country.postalCode.format?.toUpperCase() || 'N/A'}`}
                  />
                )}
  
                {country.latlng && (
                  <DetailItem
                    label="COORDINATES"
                    value={`LAT: ${country.latlng[0]}, LNG: ${country.latlng[1]}`}
                  />
                )}
              </motion.div>
            </div>
  
            {/* Neighboring Countries */}
            {neighbors.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <h3 className="text-lg font-impact text-gray-300 mb-3 tracking-wider">NEIGHBORING COUNTRIES</h3>
                <div className="flex flex-wrap gap-2">
                  {neighbors.map((neighbor) => (
                    <motion.span 
                      key={neighbor.cca3}
                      whileHover={{ scale: 1.1, backgroundColor: "#1ED760" }}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm font-impact tracking-wider"
                    >
                      {neighbor.name.common.toUpperCase()}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
  
            {/* Subregion Countries */}
            {subregionCountries.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <h3 className="text-lg font-impact text-gray-300 mb-3 tracking-wider">
                  OTHER COUNTRIES IN {country.subregion?.toUpperCase()}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {subregionCountries.slice(0, 10).map((subregionCountry) => (
                    <motion.span 
                      key={subregionCountry.cca3}
                      whileHover={{ scale: 1.1, backgroundColor: "#1ED760" }}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm font-impact tracking-wider"
                    >
                      {subregionCountry.name.common.toUpperCase()}
                    </motion.span>
                  ))}
                  {subregionCountries.length > 10 && (
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm font-impact tracking-wider"
                    >
                      +{subregionCountries.length - 10} MORE
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
  
  function DetailItem({ label, value }: { label: string; value?: string }) {
    if (!value) return null;
    
    return (
      <motion.div 
        whileHover={{ x: 5 }}
        className="mb-3"
      >
        <span className="text-sm font-impact text-gray-400 tracking-wider">{label}:</span>
        <motion.p 
          whileHover={{ color: "#1ED760" }}
          className="text-white font-impact tracking-tight"
        >
          {value}
        </motion.p>
      </motion.div>
    );
  }
}