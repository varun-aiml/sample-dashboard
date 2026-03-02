"use client";

import { useLanguage } from "@/context/LanguageContext";
import { BellIcon, SearchIcon } from "./Icons";

export const Header = () => {
    const { t, language, toggleLanguage } = useLanguage();

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 w-full transition-all">
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

            <div className="flex items-center gap-6 ms-auto">
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
        </header>
    );
};
