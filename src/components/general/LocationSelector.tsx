"use client";

import React, { useState, useEffect } from "react";

type CityResult = {
  label: string;
  city: string;
  country: string;
  iso2: string;
  id: string;
};

export default function LocationSelector({
  onSelect,
}: {
  onSelect: (city: CityResult) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length >= 2) {
        setLoading(true);
        fetch(`/api/cities?query=${query}`)
          .then((res) => res.json())
          .then((data) => setResults(data))
          .finally(() => setLoading(false));
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border p-2 rounded"
      />
      {loading && (
        <div className="absolute top-full mt-1 text-sm">Loading...</div>
      )}
      {results.length > 0 && (
        <ul className="absolute z-10 border rounded w-full mt-1 max-h-60 overflow-auto shadow">
          {results.map((city, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(city);
                setQuery(city.label); // fill in the selected label
                setResults([]);
              }}
            >
              {city.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
