import Link from "next/link";
import { cookies } from "next/headers";
import UserMenu from "./UserMenu";

export default function Header() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  return (
    <header className="bg-sky-400 text-gray-800 p-4 shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold cursor-pointer text-gray-100">
          <Link href="/" className="text-gray-100">
            Blogs App
          </Link>
        </h1>
        {token ? (
          <UserMenu />
        ) : (
          <div>
            <Link
              href="/auth/login"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
