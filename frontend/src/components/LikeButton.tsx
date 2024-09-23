"use client";

import { toggleLike } from "actions/post";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  postId: number;
  userLiked: boolean;
  likeCount: number;
}

const LikeButton = ({ postId, userLiked, likeCount }: LikeButtonProps) => {
  const handleClick = async () => {
    try {
      await toggleLike(postId);
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  return (
    <button onClick={handleClick} className="text-red-500 flex items-center">
      {userLiked ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
      <span className="text-gray-700 ml-1">
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </span>
    </button>
  );
};

export default LikeButton;
