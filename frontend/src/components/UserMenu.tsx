"use client";

import { useState, useTransition } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Logout } from "./Logout";

export default function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    startTransition(() => {
      Logout();
    });
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
      >
        <AiOutlineUser size={24} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            disabled={isPending}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
