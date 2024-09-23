"use server"

import Header from "components/Header";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineComment,
  AiFillEdit,
  AiFillDelete,
  AiOutlineUser,
} from "react-icons/ai";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deletePost, getPosts, removeComment, toggleLike } from "actions/post";
import Link from "next/link";
import ActionButton from "components/ActionButton";

export interface Post {
  id: number;
  title: string;
  content: string;
  likes: { userId: number }[];
  userLiked?: boolean;
  author: {
    id: number;
    email: string;
  };
  comments: {
    id: number;
    content: string;
    user: { id: number; email: string };
  }[];
  _count: {
    likes: number;
    comments: number;
  };
}

export default async function HomePage() {
  const cookieStore = cookies();
  const storedToken = cookieStore.get("token");
  const storedUserId = cookieStore.get("userId");

  if (storedToken == null ||!storedToken?.value || !storedUserId?.value) {
    redirect("/auth/login");
  }

  const { data } = await getPosts(storedToken.value);

  const isPostLikedByUser = (post: Post) => {
    return post.likes.some((like) => like.userId === +storedUserId.value); // Check if any like has the current user's ID
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto mt-10 px-4 md:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">
            Blogs Feed
          </h1>
          {storedToken.value && (
            <Link
              className="bg-sky-400 hover:bg-sky-600 text-white py-2 px-4 rounded md:hidden" // Hidden on desktop, shown on mobile
              href="/posts/new"
            >
              Add New Blog
            </Link>
          )}
        </div>

        <div className="grid gap-6">
          {data?.length === 0 ? (
            <p className="text-gray-700">No posts available</p>
          ) : (
            data?.map((post: any) => (
              <div
                key={post.id}
                className="border border-gray-200 bg-white p-4 rounded shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {post.title}
                </h2>
                <p className="text-gray-700">{post.content}</p>
                <p className="text-sm text-gray-500">By: {post.author.email}</p>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-2">
                    <ActionButton
                      action={() => toggleLike(post.id, storedToken.value)}
                      className="text-red-500"
                    >
                      {isPostLikedByUser(post) ? (
                        <AiFillHeart size={24} />
                      ) : (
                        <AiOutlineHeart size={24} />
                      )
                      }
                    </ActionButton>
                    <span className="text-gray-700">
                      {post._count.likes}{" "}
                      {post._count.likes === 1 ? "Like" : "Likes"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <AiOutlineComment size={24} />
                    <span className="text-gray-700">
                      {post._count.comments}{" "}
                      {post._count.comments === 1 ? "Comment" : "Comments"}
                    </span>
                  </div>
                </div>

                {storedToken.value && post.author.id === storedUserId.value && (
                  <div className="flex justify-end space-x-4 mt-4">
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="text-yellow-500 hover:text-yellow-600 flex items-center space-x-1"
                    >
                      <AiFillEdit size={20} />
                      <span>Edit</span>
                    </Link>
                    <ActionButton
                      action={() => deletePost(post.id, storedToken.value)}
                      className="text-red-500 hover:text-red-600 flex items-center space-x-1"
                    >
                      <AiFillDelete size={20} />
                      <span>Delete</span>
                    </ActionButton>
                  </div>
                )}

                <div className="mt-4">
                  {post.comments.map((comment: any) => (
                    <div
                      key={comment.id}
                      className="border-t pt-4 pb-2 text-gray-700 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="bg-gray-200 p-2 rounded-full">
                          <AiOutlineUser size={20} className="text-gray-600" />{" "}
                          {/* Profile icon */}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 flex items-center">
                            <span>By: {comment.user.email}</span>{" "}
                            {/* Author's email */}
                          </p>
                        </div>
                      </div>

                      <div className="ml-8">
                        <p className="text-sm">{comment.content}</p>

                        {storedToken.value &&
                          comment.user.id === storedUserId.value && (
                            <ActionButton
                              action={() =>
                                removeComment(
                                  post.id,
                                  comment.id,
                                  storedToken.value
                                )
                              }
                              className="text-red-500 text-xs mt-2"
                            >
                              Delete
                            </ActionButton>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="text-black border p-2 rounded w-full focus:ring-2 focus:ring-blue-300"
                    // onKeyDown={(e) => {
                    //   if (e.key === "Enter") {
                    //     // addComment(
                    //     //   post.id,
                    //     //   (e.target as HTMLInputElement).value
                    //     // );
                    //     (e.target as HTMLInputElement).value = "";
                    //   }
                    // }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
        {storedToken.value && (
          <Link
            className="hidden md:block bg-sky-400 hover:bg-sky-600 text-white py-3 px-6 rounded-full fixed bottom-8 right-8 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            href="/posts/new"
          >
            Add New Blog
          </Link>
        )}
      </div>
    </div>
  );
}
