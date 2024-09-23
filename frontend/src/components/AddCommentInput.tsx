"use client";

import { addComment } from "actions/post";
import { useState } from "react";

interface AddCommentInputProps {
  postId: number;
}

const AddCommentInput = ({ postId }: AddCommentInputProps) => {
  const [commentText, setCommentText] = useState("");

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && commentText.trim() !== "") {
      try {
        await addComment(postId, commentText);
        setCommentText("");
      } catch (err) {
        console.error("Failed to add comment", err);
      }
    }
  };

  return (
    <input
      type="text"
      placeholder="Add a comment..."
      className="text-black border p-2 rounded w-full focus:ring-2 focus:ring-blue-300"
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

export default AddCommentInput;
