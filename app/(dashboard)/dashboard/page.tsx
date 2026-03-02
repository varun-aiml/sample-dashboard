"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { TransactionIcon } from "@/components/Icons";
import {
    fetchAllTransactions,
    fetchSuccessfulTransactions,
    fetchFailedTransactions,
    Transaction
} from "@/services/transactionService";

export default function DashboardPage() {
    const { t } = useLanguage();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'success' | 'failed'>('all');

    useEffect(() => {
        const loadTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                let data: Transaction[] = [];
                if (activeFilter === 'all') {
                    data = await fetchAllTransactions();
                } else if (activeFilter === 'success') {
                    data = await fetchSuccessfulTransactions();
                } else if (activeFilter === 'failed') {
                    data = await fetchFailedTransactions();
                }
                setTransactions(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch transactions');
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, [activeFilter]);

    const stats = [
        { id: 'all', title: t("dashboard.totalTransactions"), value: "1,234", icon: <TransactionIcon className="w-6 h-6 text-[#635BFF]" />, bg: "bg-[#635BFF]/10", activeBorder: "border-[#635BFF]" },
        { id: 'success', title: t("dashboard.successfulPayments"), value: "1,180", icon: <TransactionIcon className="w-6 h-6 text-[#00C853]" />, bg: "bg-[#00C853]/10", activeBorder: "border-[#00C853]" },
        { id: 'failed', title: t("dashboard.failedPayments"), value: "54", icon: <TransactionIcon className="w-6 h-6 text-[#FF3B30]" />, bg: "bg-[#FF3B30]/10", activeBorder: "border-[#FF3B30]" },
        { id: 'revenue', title: t("dashboard.revenueToday"), value: "SAR 45,200", icon: <TransactionIcon className="w-6 h-6 text-[#0A2540]" />, bg: "bg-[#0A2540]/10", activeBorder: "border-[#0A2540]" },
    ];

    const handleCardClick = (id: string) => {
        if (id === 'all' || id === 'success' || id === 'failed') {
            setActiveFilter(id);
        }
    };

    return (
        <div className="space-y-8 transition-all duration-500 text-start">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const isClickable = ['all', 'success', 'failed'].includes(stat.id);
                    const isActive = activeFilter === stat.id;

                    return (
                        <div
                            key={stat.id}
                            onClick={() => isClickable && handleCardClick(stat.id)}
                            className={`bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between transition-all ${isActive ? `border-2 ${stat.activeBorder}` : 'border border-gray-100'
                                } ${isClickable ? 'cursor-pointer hover:shadow-md hover:border-gray-300' : ''}`}
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold text-[#0A2540]">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                {stat.icon}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-[#0A2540]">{t("dashboard.recentTransactions")}</h2>
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[600px] text-start">
                        <thead className="bg-[#F5F7FA] text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4 font-medium text-start">{t("table.transactionId")}</th>
                                <th className="px-6 py-4 font-medium text-start">{t("table.userName")}</th>
                                <th className="px-6 py-4 font-medium text-start">{t("table.amount")}</th>
                                <th className="px-6 py-4 font-medium text-start">{t("table.paymentMethod")}</th>
                                <th className="px-6 py-4 font-medium text-start">{t("table.status")}</th>
                                <th className="px-6 py-4 font-medium text-start">{t("table.date")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                                        <div className="flex justify-center items-center space-x-2">
                                            <div className="w-5 h-5 flex rounded-full animate-spin border-2 border-[#0A2540] border-t-transparent"></div>
                                            <span>Loading transactions...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-red-500">
                                        {error}
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((txn, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A2540] text-start">{txn.transactionId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-start">{txn.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A2540] text-start">SAR {txn.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-start">
                                            <span className="bg-gray-100 text-[#0A2540] px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
                                                {txn.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-start">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${txn.status === 'Success' ? 'bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20' :
                                                txn.status === 'Failed' ? 'bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/20' :
                                                    'bg-orange-100 text-orange-600 border-orange-200'
                                                }`}>
                                                {txn.status === 'Success' ? t("status.success") :
                                                    txn.status === 'Failed' ? t("status.failed") :
                                                        txn.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-start">
                                            {new Date(txn.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
