"use client";

import React, { useState, useEffect } from "react";

type LocationData = {
    country: string;
    state: string;
    city: string;
    area?: string;
    postalCode?: string;
    lat: number;
    lon: number;
    accuracy?: number; // meters
};

async function getAddressFromGoogle(lat: number, lng: number) {
    const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
    const data = await res.json();

    console.log("Google full response:", data); // DEBUG

    if (data.status !== "OK") {
        console.error("Google API status:", data.status);
        throw new Error(data.status);
    }

    const components = data.results[0].address_components;

    const get = (type: string) =>
        components.find((c: any) => c.types.includes(type))?.long_name || "";

    return {
        country: get("country"),
        state: get("administrative_area_level_1"),
        city:
            get("locality") ||
            get("administrative_area_level_2") ||
            get("sublocality"),
        area: get("sublocality") || get("neighborhood"),
        postalCode: get("postal_code"),
    };
}

export default function UserLocation() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [locationType, setLocationType] = useState<"gps" | "ip" | null>(null);
    const [statusMessage, setStatusMessage] = useState("Detecting location...");

    useEffect(() => {
        detectLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const detectLocation = () => {
        setLoading(true);
        setError(null);
        setLocationData(null);
        setLocationType(null);
        setStatusMessage("Requesting geolocation permission...");

        if (!navigator.geolocation) {
            handleIpFallback("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                setStatusMessage("Fetching exact address...");
                try {
                    const { latitude, longitude, accuracy } = position.coords;

                    const address = await getAddressFromGoogle(latitude, longitude);

                    setLocationData({
                        lat: latitude,
                        lon: longitude,
                        accuracy: Math.round(accuracy),
                        ...address,
                    });
                    setLocationType("gps");
                    setLoading(false);
                } catch (err: any) {
                    console.error("Google Geocoding Error:", err);
                    handleIpFallback("Failed to get address. Falling back to approximate location.");
                }
            },
            (err) => {
                console.warn("Geolocation error:", err);
                handleIpFallback("Permission denied or timeout. Using approximate location.");
            },
            {
                enableHighAccuracy: true,
                timeout: 15000
            }
        );
    };

    const handleIpFallback = async (message: string) => {
        setStatusMessage(message);
        try {
            const response = await fetch("https://ipapi.co/json/");
            if (!response.ok) throw new Error("IP Geolocation failed");

            const data = await response.json();

            if (data.error) throw new Error(data.reason || "IP Geolocation failed");

            setLocationData({
                country: data.country_name || "",
                state: data.region || "",
                city: data.city || "",
                lat: data.latitude,
                lon: data.longitude,
            });
            setLocationType("ip");
        } catch (err: any) {
            setError(err.message || "Failed to detect location");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 w-full relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b border-gray-100 pb-4 gap-4">
                <h2 className="text-xl font-semibold text-[#0A2540] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Device Location
                </h2>
                {locationType && (
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${locationType === 'gps' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                        {locationType === 'gps' ? 'High Accuracy (GPS)' : 'Approximate'}
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                    <div className="w-10 h-10 rounded-full animate-spin border-4 border-indigo-600 border-t-transparent"></div>
                    <p className="text-sm font-medium text-gray-600">{statusMessage}</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-5 rounded-xl text-sm font-medium flex flex-col items-center gap-3">
                    <p className="flex items-center gap-2 text-base">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </p>
                    <button onClick={detectLocation} className="text-sm bg-white px-5 py-2 rounded-lg w-fit border border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors shadow-sm font-semibold mt-2">
                        Retry Detection
                    </button>
                </div>
            ) : locationData ? (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Country</p>
                                <p className="text-base font-medium text-[#0A2540]">{locationData.country || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">State / Region</p>
                                <p className="text-base font-medium text-[#0A2540]">{locationData.state || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">City</p>
                                <p className="text-base font-medium text-[#0A2540]">{locationData.city || "N/A"}</p>
                            </div>
                            {locationType === 'gps' && locationData.area ? (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Area / Suburb</p>
                                    <p className="text-base font-medium text-[#0A2540]">{locationData.area}</p>
                                </div>
                            ) : null}
                            {locationType === 'gps' && locationData.postalCode ? (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Postal Code</p>
                                    <p className="text-base font-medium text-[#0A2540]">{locationData.postalCode}</p>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100">
                            <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-1.5">Latitude</p>
                            <p className="text-sm font-medium text-indigo-950 truncate">{locationData.lat.toFixed(6)}</p>
                        </div>
                        <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100">
                            <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-1.5">Longitude</p>
                            <p className="text-sm font-medium text-indigo-950 truncate">{locationData.lon.toFixed(6)}</p>
                        </div>
                        {locationData.accuracy && (
                            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100">
                                <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-1.5">Accuracy</p>
                                <p className="text-sm font-medium text-indigo-950">~{locationData.accuracy} meters</p>
                            </div>
                        )}
                    </div>

                    {locationType === "ip" && (
                        <div className="flex items-center gap-3 text-sm text-amber-800 bg-amber-50 p-4 rounded-xl border border-amber-200 mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>Permission denied — using approximate location based on IP address.</p>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}
