"use client";

import { removeComment } from "actions/post";

interface RemoveCommentButtonProps {
  postId: number;
  commentId: number;
}

const RemoveCommentButton = ({
  postId,
  commentId,
}: RemoveCommentButtonProps) => {
  const handleClick = async () => {
    try {
      await removeComment(postId, commentId);
    } catch (err) {
      console.error("Failed to remove comment", err);
    }
  };

  return (
    <button onClick={handleClick} className="text-red-500 text-xs mt-2">
      Delete
    </button>
  );
};

export default RemoveCommentButton;
