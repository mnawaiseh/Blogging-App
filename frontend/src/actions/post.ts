'use server'

import { revalidatePath } from 'next/cache'
import axios from "axios";

export const getPosts = async (token: string): Promise<any> => {
    const res = await axios.get('http://backend:4000/api/posts', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).catch((err) => {
        console.log(err);
    });

    return res;
}

export const deletePost = async (postId: number, token: string) => {
    try {
        await axios.delete(`http://backend:4000/api/posts/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        revalidatePath("/")
    } catch (error) {
        console.error('Failed to delete post', error);
    }
};


export const addComment = async (postId: number, comment: string, token: string) => {
    try {
        const res = await axios.post(
            `http://backend:4000/api/posts/${postId}/comments`,
            { content: comment },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        revalidatePath("/")
    } catch (error) {
        console.error("Failed to add comment", error);
    }
};

export const removeComment = async (postId: number, commentId: number, token: string) => {
    try {
        await axios.delete(
            `http://backend:4000/api/posts/${postId}/comments/${commentId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        revalidatePath("/")
    } catch (error) {
        console.error("Failed to delete comment", error);
    }
};


export const toggleLike = async (postId: number, token: string) => {
    try {
        const res = await axios.post(
            `http://backend:4000/api/posts/${postId}/like`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        revalidatePath("/")
    } catch (error) {
        console.error("Failed to toggle like", error);
    }
};
