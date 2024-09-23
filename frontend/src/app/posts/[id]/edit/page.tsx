import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "components/Header";
import React from "react";
import axios from "axios";

interface EditPostPageProps {
  params: {
    id: string;
  };
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    email: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = params;
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const userId = cookieStore.get("userId")?.value;

  if (!token || !userId) {
    redirect("/auth/login");
  }

  let post: Post;
  try {
    const postRes = await axios.get<Post>(
      `http://backend:4000/api/posts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    post = postRes.data;
  } catch (error: any) {
    console.error("Failed to fetch post data:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch post data"
    );
  }

  if (post.author.id !== Number(userId)) {
    throw new Error("You are not authorized to edit this post");
  }

  async function handleEditPost(formData: FormData) {
    "use server";

    const updatedTitle = formData.get("title");
    const updatedContent = formData.get("content");

    if (
      typeof updatedTitle !== "string" ||
      typeof updatedContent !== "string" ||
      !updatedTitle.trim() ||
      !updatedContent.trim()
    ) {
      throw new Error("Title and Content are required");
    }

    try {
      const res = await axios.put(
        `http://backend:4000/api/posts/${id}`,
        {
          title: updatedTitle.trim(),
          content: updatedContent.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to update post");
      }
    } catch (error: any) {
      console.error("Error updating post:", error);
      throw new Error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }

    redirect("/");
  }

  return (
    <div className="edit-post-page">
      <Header />
      <div className="container mx-auto mt-10 px-4 md:px-0">
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
        <form
          action={handleEditPost}
          className="bg-white p-6 rounded shadow-lg max-w-2xl mx-auto"
        >
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-gray-700">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={post.title}
              className="text-black border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block mb-2 text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              defaultValue={post.content}
              className="text-black border p-3 rounded w-full h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Update Blog
          </button>
        </form>
      </div>
    </div>
  );
}
