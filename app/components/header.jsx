"use client";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  return (
    <header
      className="w-full h-12 bg-white shadow-sm flex items-center justify-center border-b border-slate-200"
      onClick={() => router.push("/")}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent font-dancing text-2xl font-bold italic tracking-widest cursor-pointer">
        DashBoard HR & Payroll System
      </div>
    </header>
  );
};

export default Header;
