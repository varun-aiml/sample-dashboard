"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex bg-[#F5F7FA] min-h-screen font-sans">
            <Sidebar />
            <div className="flex-1 ms-64 flex flex-col min-h-screen w-full overflow-hidden">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
