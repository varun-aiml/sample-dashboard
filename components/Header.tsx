"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";
import { BellIcon, SearchIcon } from "./Icons";
import UserLocation from "./UserLocation";

export const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
    const { t, language, toggleLanguage } = useLanguage();
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-10 w-full transition-all">
            <div className="flex items-center flex-1 gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ms-2 text-gray-500 hover:text-[#0A2540] transition-colors rounded-lg hover:bg-gray-100"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="flex items-center w-full max-w-md hidden md:flex">
                    <div className="relative w-full">
                        <span className="absolute inset-y-0 start-0 flex items-center ps-4">
                            <SearchIcon className="w-5 h-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder={t("header.search")}
                            className="w-full bg-[#F5F7FA] border-none rounded-xl py-2.5 ps-12 pe-4 focus:ring-2 focus:ring-[#635BFF]/50 outline-none transition-all placeholder-gray-400 text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 ms-auto">
                <button
                    onClick={() => setShowLocationModal(true)}
                    className="flex items-center gap-2 font-medium text-white bg-[#0A2540] hover:bg-[#1a3a5e] transition-colors text-sm px-4 py-2 rounded-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="hidden sm:inline">Get Location</span>
                </button>

                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 font-medium text-[#0A2540] hover:text-[#635BFF] transition-colors text-sm px-3 py-1.5 rounded-lg border border-gray-200"
                >
                    {language === "en" ? "AR" : "EN"}
                </button>

                <button className="relative p-2 text-gray-400 hover:text-[#0A2540] transition-colors rounded-full hover:bg-gray-100">
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-[#FF3B30] rounded-full ring-2 ring-white"></span>
                </button>

                <div className="flex items-center gap-3 ps-4 border-s border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#0A2540] flex items-center justify-center text-white font-bold text-sm shadow-md">
                        AM
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-[#0A2540]">Admin User</p>
                        <p className="text-xs text-gray-500">SaudiPay Admin</p>
                    </div>
                </div>
            </div>

            {showLocationModal && mounted && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-start">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setShowLocationModal(false)}
                            className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="p-2 sm:p-4 mt-8 sm:mt-0">
                            <UserLocation />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </header>
    );
};
