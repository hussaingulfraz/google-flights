import React, { useState } from "react";
import axios from "axios";
import './index.css'
const FlightSearch = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("price");
  const [filterAirline, setFilterAirline] = useState("");

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://sky-scanner3.p.rapidapi.com/api/v1/searchFlights", {
        params: {
          from,
          to,
          date,
        },
        headers: {
          "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
          "X-RapidAPI-Host": "sky-scanner3.p.rapidapi.com",
        },
      });
      setFlights(response.data.flights || []);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
    setLoading(false);
  };

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortOption === "price") return a.price - b.price;
    if (sortOption === "duration") return a.duration - b.duration;
    return 0;
  });

  const filteredFlights = sortedFlights.filter(flight => 
    filterAirline ? flight.airline.toLowerCase().includes(filterAirline.toLowerCase()) : true
  );

  return (
    <div className="p-4 max-w-lg mx-auto flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold mb-4">Flight Search</h1>
      <div className="w-full flex flex-col gap-2 md:flex-row md:gap-4">
        <input type="text" placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} className="border p-2 rounded w-full" />
        <input type="text" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} className="border p-2 rounded w-full" />
      </div>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 rounded w-full mt-2" />
      <button onClick={fetchFlights} className="bg-blue-500 text-white p-2 rounded w-full mt-2 md:w-auto">Search</button>
      
      <div className="w-full mt-4 flex flex-col md:flex-row md:justify-between">
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="border p-2 rounded w-full md:w-1/2">
          <option value="price">Sort by Price</option>
          <option value="duration">Sort by Duration</option>
        </select>
        <input type="text" placeholder="Filter by Airline" value={filterAirline} onChange={(e) => setFilterAirline(e.target.value)} className="border p-2 rounded w-full md:w-1/2 mt-2 md:mt-0" />
      </div>
      
      {loading && <p className="mt-4">Loading flights...</p>}
      <ul className="mt-4 w-full">
        {filteredFlights.map((flight, index) => (
          <li key={index} className="border p-2 mb-2 rounded bg-gray-100 shadow-md">
            <span className="font-semibold">{flight.airline}</span> - ${flight.price} - {flight.duration} mins
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightSearch;
