"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { useState } from "react";

const Navbar: React.FC = () => {
  const { user, isLoading } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* Left side - Navigation links */}
      <div className="flex space-x-6">
        <Link href="/game" className="hover:text-gray-300">
          PVE
        </Link>
        <Link href="/pvp" className="hover:text-gray-300">
          PVP
        </Link>
      </div>

      {/* Right side - Dropdown */}
      <div className="relative">
        
      </div>
    </nav>
  );
};

export default Navbar;
