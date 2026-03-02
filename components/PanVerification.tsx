"use client";

import React, { useState } from "react";
import Tesseract from "tesseract.js";

type PanDetails = {
    panNumber: string;
    fullName: string;
    dateOfBirth: string;
};

export default function PanVerification() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const [details, setDetails] = useState<PanDetails>({
        panNumber: "",
        fullName: "",
        dateOfBirth: "",
    });

    // ---------------- IMAGE UPLOAD ----------------
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const file = e.target.files[0];
        console.log("📤 Uploaded File:", file.name);

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    // ---------------- OCR PROCESS ----------------
    const scanPan = async () => {
        if (!image) return;

        setLoading(true);

        const { data } = await Tesseract.recognize(image, "eng", {
            logger: (m) => {
                if (m.status === "recognizing text") {
                    setProgress(Math.round(m.progress * 100));
                }
            }
        });

        console.log("🧾 RAW OCR TEXT:\n", data.text);

        const extracted = extractPanDetails(data.text);
        console.log("✅ FINAL EXTRACTED DATA:", extracted);

        setDetails(extracted);
        setLoading(false);
    };

    // ---------------- PAN PARSER ----------------
    function extractPanDetails(text: string): PanDetails {
        const lines = text
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 2);

        console.log("📄 CLEANED LINES:", lines);

        // PAN NUMBER
        const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/;
        const panNumber = text.match(panRegex)?.[0] || "";
        console.log("🔎 Detected PAN:", panNumber);

        // DOB
        const dobRegex = /\d{2}\/\d{2}\/\d{4}/;
        const dateOfBirth = text.match(dobRegex)?.[0] || "";
        console.log("🎂 Detected DOB:", dateOfBirth);

        // -------- UNIVERSAL PAN NAME DETECTION --------
        let fullName = "";

        const panIndex = lines.findIndex(l => panRegex.test(l));
        const dobIndex = lines.findIndex(l => dobRegex.test(l));

        console.log("📍 PAN index:", panIndex);
        console.log("📍 DOB index:", dobIndex);

        // Step 1: search between PAN and DOB
        if (panIndex !== -1 && dobIndex !== -1) {
            for (let i = panIndex + 1; i < dobIndex; i++) {
                let candidate = lines[i];
                console.log("🧠 Candidate between PAN-DOB:", candidate);

                // Keep only English letters and spaces
                candidate = candidate.replace(/[^A-Za-z\s]/g, "").trim();

                const upperCandidate = candidate.toUpperCase();

                const blacklist = [
                    "FATHER", "GOVT", "INDIA", "INCOME", "DEPARTMENT",
                    "ACCOUNT", "NUMBER", "CARD", "SIGNATURE", "NAME"
                ];

                // If this line contains any blacklisted word, ignore it
                if (blacklist.some(b => upperCandidate.includes(b))) {
                    console.log("⛔ Blacklisted word found, skipping:", candidate);
                    continue;
                }

                const words = candidate.split(/\s+/).filter(w => w.length >= 2);
                console.log("🧹 Clean words:", words);

                // name usually has 2 or more words
                if (words.length >= 2) {
                    fullName = words.join(" ").toUpperCase();
                    console.log("👤 FINAL NAME (PAN-DOB rule):", fullName);
                    break;
                }
            }
        }

        // Step 2: fallback → longest uppercase line without blacklisted words
        if (!fullName) {
            console.log("⚠️ Using fallback name detection");

            let bestCandidate = "";

            for (const line of lines) {
                const cleaned = line.replace(/[^A-Za-z\s]/g, "").trim();
                const upperCandidate = cleaned.toUpperCase();

                const blacklist = [
                    "FATHER", "GOVT", "INDIA", "INCOME", "DEPARTMENT",
                    "ACCOUNT", "NUMBER", "CARD", "SIGNATURE", "NAME"
                ];

                if (blacklist.some(b => upperCandidate.includes(b))) {
                    continue;
                }

                const words = cleaned.split(/\s+/).filter(w => w.length >= 2);

                if (words.length >= 2 && cleaned.length > bestCandidate.length) {
                    bestCandidate = cleaned;
                }
            }

            fullName = bestCandidate.toUpperCase();
            console.log("👤 FINAL NAME (fallback):", fullName);
        }

        return { panNumber, fullName, dateOfBirth };
    }

    // ---------------- UI ----------------
    return (
        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 w-full">
            <div className="w-full md:w-1/2 flex flex-col">
                <h2 className="text-xl font-semibold mb-4 text-[#0A2540]">Onboarding - PAN Verification</h2>

                <input className="w-full text-sm sm:text-base border p-2 rounded" type="file" accept="image/*" onChange={handleFileChange} />

                {preview && (
                    <img src={preview} alt="preview" className="mt-4 w-full md:w-64 rounded-lg border max-w-full" />
                )}

                <button
                    onClick={scanPan}
                    className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg w-full md:w-auto font-medium"
                >
                    Scan PAN
                </button>

                {loading && <p className="mt-2 text-sm text-gray-500">Scanning... {progress}%</p>}
            </div>

            <div className="w-full md:w-1/2 flex flex-col">
                <h2 className="text-xl font-semibold mb-4 text-[#0A2540]">Extracted Details</h2>

                <div className="space-y-4">
                    <input className="border p-2 w-full rounded focus:outline-none" placeholder="Full Name" value={details.fullName} readOnly />
                    <input className="border p-2 w-full rounded focus:outline-none" placeholder="Date of Birth" value={details.dateOfBirth} readOnly />
                    <input className="border p-2 w-full rounded focus:outline-none" placeholder="PAN Number" value={details.panNumber} readOnly />
                </div>
            </div>
        </div>
    );
}