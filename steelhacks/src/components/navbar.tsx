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
        <Link href="/pve" className="hover:text-gray-300">
          PVE
        </Link>
        <Link href="/pvp" className="hover:text-gray-300">
          PVP
        </Link>
      </div>

      {/* Right side - Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-600"
        >
          Menu ▾
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
            {isLoading ? (
              <div className="px-4 py-2">Loading...</div>
            ) : user ? (
              <>
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  href="/auth/logout"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
