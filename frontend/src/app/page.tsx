"use server";

import Header from "components/Header";
import { getPosts } from "actions/post";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LikeButton from "components/LikeButton";
import DeletePostButton from "components/DeletePostButton";
import RemoveCommentButton from "components/RemoveCommentButton";
import AddCommentInput from "components/AddCommentInput";
import { AiOutlineComment, AiFillEdit, AiOutlineUser } from "react-icons/ai";

export default async function HomePage() {
  const cookieStore = cookies();
  const storedToken = cookieStore.get("token")?.value;
  const storedUserId = cookieStore.get("userId")?.value;

  if (!storedToken || !storedUserId) {
    redirect("/auth/login");
  }

  const currentUserId = Number(storedUserId);

  const posts = await getPosts();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto mt-10 px-4 md:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">
            Blogs Feed
          </h1>
          <Link
            className="bg-sky-400 hover:bg-sky-600 text-white py-2 px-4 rounded md:hidden"
            href="/posts/new"
          >
            Add New Blog
          </Link>
        </div>

        <div className="grid gap-6">
          {posts?.length === 0 ? (
            <p className="text-gray-700">No posts available</p>
          ) : (
            posts.map((post: any) => {
              const userLiked = post.likes.some(
                (like: any) => like.userId === currentUserId
              );

              return (
                <div
                  key={post.id}
                  className="border border-gray-200 bg-white p-4 rounded shadow-sm"
                >
                  <h2 className="text-xl font-semibold text-gray-800">
                    {post.title}
                  </h2>
                  <p className="text-gray-700">{post.content}</p>
                  <p className="text-sm text-gray-500">
                    By: {post.author.email}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <LikeButton
                      postId={post.id}
                      userLiked={userLiked}
                      likeCount={post._count.likes}
                    />

                    <div className="flex items-center space-x-2">
                      <AiOutlineComment size={24} />
                      <span className="text-gray-700">
                        {post._count.comments}{" "}
                        {post._count.comments === 1 ? "Comment" : "Comments"}
                      </span>
                    </div>
                  </div>

                  {post.author.id === currentUserId && (
                    <div className="flex justify-end space-x-4 mt-4">
                      <Link
                        href={`/posts/${post.id}/edit`}
                        className="text-yellow-500 hover:text-yellow-600 flex items-center space-x-1"
                      >
                        <AiFillEdit size={20} />
                        <span>Edit</span>
                      </Link>
                      <DeletePostButton postId={post.id} />
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
                            <AiOutlineUser
                              size={20}
                              className="text-gray-600"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              By: {comment.user.email}
                            </p>
                          </div>
                        </div>

                        <div className="ml-8">
                          <p className="text-sm">{comment.content}</p>

                          {comment.user.id === currentUserId && (
                            <RemoveCommentButton
                              postId={post.id}
                              commentId={comment.id}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <AddCommentInput postId={post.id} />
                  </div>
                </div>
              );
            })
          )}
        </div>
        <Link
          className="hidden md:block bg-sky-400 hover:bg-sky-600 text-white py-3 px-6 rounded-full fixed bottom-8 right-8 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          href="/posts/new"
        >
          Add New Blog
        </Link>
      </div>
    </div>
  );
}
