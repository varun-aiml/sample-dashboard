"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { HomeIcon, TransactionIcon, ProfileIcon, SettingsIcon, OnboardingIcon } from "./Icons";

export const Sidebar = () => {
    const { t } = useLanguage();
    const pathname = usePathname();

    const navItems = [
        { name: t("sidebar.dashboard"), href: "/dashboard", icon: HomeIcon },
        { name: t("sidebar.transactions"), href: "/transactions", icon: TransactionIcon },
        { name: t("sidebar.profile"), href: "/profile", icon: ProfileIcon },
        { name: t("sidebar.settings"), href: "#", icon: SettingsIcon },
        { name: t("sidebar.onboarding"), href: "/onboarding", icon: OnboardingIcon },
    ];

    return (
        <div className="w-64 bg-white border-e border-gray-100 flex flex-col h-screen fixed inset-y-0 start-0 z-10 shadow-sm">
            <div className="h-20 flex items-center justify-center border-b border-gray-100">
                <h1 className="text-2xl font-bold text-[#0A2540]">SaudiPay</h1>
            </div>
            <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? "bg-[#635BFF]/10 text-[#635BFF] font-medium"
                                : "text-gray-500 hover:bg-gray-50 hover:text-[#0A2540]"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
