import Link from "next/link";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (token?.value.length) {
    redirect("/");
  }

  const handleSubmit = async (formData: FormData) => {
    "use server";
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const res = await axios.post(`http://backend:4000/api/auth/${mode}`, {
        email,
        password,
      });

      cookies().set("token", res.data.token);
      cookies().set("email", res.data.user.email);
      cookies().set("userId", res.data.user.id);
      redirect("/");
    } catch (err) {
      console.log("err:", err);
      // setError('Authentication failed because : ' + err);
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen px-4 md:px-0">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-black text-3xl font-bold mb-6 text-center">
          {mode === "login" ? "Login" : "Signup"}
        </h1>
        <form action={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="text-black border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="text-black text-black border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {mode === "login" ? "Login" : "Signup"}
          </button>
        </form>

        {mode === "login" && (
          <p className="text-center text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-blue-500 hover:underline">
              Sign up here
            </Link>
          </p>
        )}

        {mode === "signup" && (
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
