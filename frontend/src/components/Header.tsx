'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineUser } from 'react-icons/ai';

export default function Header() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /**
   * Handles the logout process by removing the user's authentication details
   * from local storage (token, email, and userId) and redirects the user to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    router.push('/auth/login');
  };

  /**
   * Toggles the dropdown state between open and closed.
   * It updates the state to show or hide the dropdown menu.
   */
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-sky-400 text-gray-800 p-4 shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-2xl font-bold cursor-pointer text-gray-100"
          onClick={() => router.push('/')}
        >
          Blogs App
        </h1>
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
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
