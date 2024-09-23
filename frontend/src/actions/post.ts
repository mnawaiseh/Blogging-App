"use server";

import { revalidatePath } from "next/cache";
import axios from "axios";
import { cookies } from "next/headers";

export async function getPosts(): Promise<any> {
  const cookieStore = cookies();
  const storedToken = cookieStore.get("token")?.value;

  if (!storedToken) {
    throw new Error("Not authenticated");
  }

  try {
    const res = await axios.get("http://backend:4000/api/posts", {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch posts", err);
    return [];
  }
}

export async function deletePost(postId: number) {
  const cookieStore = cookies();
  const storedToken = cookieStore.get("token")?.value;

  if (!storedToken) {
    throw new Error("Not authenticated");
  }

  try {
    await axios.delete(`http://backend:4000/api/posts/${postId}`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to delete post", error);
  }
}

export async function addComment(postId: number, comment: string) {
  const cookieStore = cookies();
  const storedToken = cookieStore.get("token")?.value;

  if (!storedToken) {
    throw new Error("Not authenticated");
  }

  try {
    await axios.post(
      `http://backend:4000/api/posts/${postId}/comments`,
      { content: comment },
      {
        headers: { Authorization: `Bearer ${storedToken}` },
      }
    );
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to add comment", error);
  }
}

export async function removeComment(postId: number, commentId: number) {
  const cookieStore = cookies();
  const storedToken = cookieStore.get("token")?.value;

  if (!storedToken) {
    throw new Error("Not authenticated");
  }

  try {
    await axios.delete(
      `http://backend:4000/api/posts/${postId}/comments/${commentId}`,
      {
        headers: { Authorization: `Bearer ${storedToken}` },
      }
    );
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to delete comment", error);
  }
}

export async function toggleLike(postId: number) {
  const cookieStore = cookies();
  const storedToken = cookieStore.get("token")?.value;

  if (!storedToken) {
    throw new Error("Not authenticated");
  }

  try {
    await axios.post(
      `http://backend:4000/api/posts/${postId}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${storedToken}` },
      }
    );
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to toggle like", error);
  }
}
