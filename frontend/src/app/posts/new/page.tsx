import axios from "axios";
import Header from "components/Header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AddPostPage() {
  const token = cookies().get("token") || { value: "" };

  const handleSubmit = async (formData: FormData) => {
    "use server";

    if (!token.value) {
      redirect("/auth/login");
    }

    await axios
      .post(
        "http://backend:4000/api/posts",
        {
          title: formData.get("title"),
          content: formData.get("content"),
        },
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      )
      .catch(() => {
        throw new Error("Failed to create post");
      });

    redirect("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto mt-10 px-4 md:px-0">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Blog</h1>

        <form
          action={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
        >
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              className="border border-gray-300 p-3 rounded w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Content</label>
            <textarea
              name="content"
              className="border border-gray-300 p-3 rounded w-full h-40 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Add Blog
          </button>
        </form>
      </div>
    </div>
  );
}
