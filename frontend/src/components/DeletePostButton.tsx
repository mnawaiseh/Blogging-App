"use client";

import { deletePost } from "actions/post";
import { AiFillDelete } from "react-icons/ai";

interface DeletePostButtonProps {
  postId: number;
}

const DeletePostButton = ({ postId }: DeletePostButtonProps) => {
  const handleClick = async () => {
    try {
      await deletePost(postId);
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-red-500 hover:text-red-600 flex items-center space-x-1"
    >
      <AiFillDelete size={20} />
      <span>Delete</span>
    </button>
  );
};

export default DeletePostButton;
