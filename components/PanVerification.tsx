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
        <div className="p-6 bg-white rounded-xl shadow-md grid grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-semibold mb-4">Onboarding - PAN Verification</h2>

                <input type="file" accept="image/*" onChange={handleFileChange} />

                {preview && (
                    <img src={preview} alt="preview" className="mt-4 w-64 rounded-lg border" />
                )}

                <button
                    onClick={scanPan}
                    className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg"
                >
                    Scan PAN
                </button>

                {loading && <p className="mt-2">Scanning... {progress}%</p>}
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Extracted Details</h2>

                <div className="space-y-4">
                    <input className="border p-2 w-full rounded" placeholder="Full Name" value={details.fullName} readOnly />
                    <input className="border p-2 w-full rounded" placeholder="Date of Birth" value={details.dateOfBirth} readOnly />
                    <input className="border p-2 w-full rounded" placeholder="PAN Number" value={details.panNumber} readOnly />
                </div>
            </div>
        </div>
    );
}