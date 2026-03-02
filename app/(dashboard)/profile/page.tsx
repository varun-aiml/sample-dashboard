"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ProfilePage() {
    const { t } = useLanguage();

    return (
        <div className="max-w-4xl mx-auto space-y-6 transition-all duration-500 text-start">
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-sm border border-gray-100 text-start">
                <h2 className="text-2xl font-bold text-[#0A2540] mb-8">{t("profile.title")}</h2>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 pb-10 border-b border-gray-100">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#0A2540] flex items-center justify-center text-white font-bold text-3xl shadow-lg ring-4 ring-gray-50 shrink-0">
                        AM
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#0A2540]">Admin User</h3>
                        <p className="text-gray-500 mt-1">admin@saudipay.com</p>
                    </div>
                    <div className="shrink-0">
                        <button className="bg-[#F5F7FA] hover:bg-gray-200 text-[#0A2540] px-5 py-2.5 rounded-xl font-medium transition-colors text-sm border border-gray-200">
                            {t("profile.editProfile")}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-2">{t("profile.name")}</p>
                        <p className="text-[#0A2540] font-semibold text-lg">Admin User</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-2">{t("profile.email")}</p>
                        <p className="text-[#0A2540] font-semibold text-lg">admin@saudipay.com</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-2">{t("profile.phone")}</p>
                        <p className="text-[#0A2540] font-semibold text-lg" dir="ltr" style={{ textAlign: 'start' }}>+966 50 123 4567</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-2">{t("profile.company")}</p>
                        <p className="text-[#0A2540] font-semibold text-lg">SaudiPay Inc.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-2">{t("profile.country")}</p>
                        <p className="text-[#0A2540] font-semibold text-lg">Saudi Arabia</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
