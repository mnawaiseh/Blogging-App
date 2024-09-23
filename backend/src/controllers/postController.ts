import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Creates a new blog post.
 *
 * @param req - Express request object containing the post's title and content in the body.
 *              The user's ID is extracted from the authenticated user (req.user).
 * @param res - Express response object used to send the created post.
 * 
 * @returns A 201 response with the created post.
 */
export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user?.id;

  const post = await prisma.post.create({
    data: { title, content, authorId: userId },
  });

  res.status(201).json(post);
};

/**
 * Fetches all blog posts, including their authors, comments, likes, and counts.
 *
 * @param req - Express request object. The user's ID is extracted from the authenticated user (req.user).
 * @param res - Express response object used to send the list of posts.
 * 
 * @returns A 200 response with an array of posts, including information about authors, likes, comments, and whether the current user has liked each post.
 */
export const getPosts = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          email: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
      likes: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  // Check if the logged-in user liked the post
  const postsWithUserLiked = posts.map((post) => ({
    ...post,
    userLiked: post.likes.some((like) => like.user.id === userId),
  }));

  res.json(postsWithUserLiked);
};

/**
 * Fetches a single blog post by its ID.
 *
 * @param req - Express request object containing the post ID in the params.
 * @param res - Express response object used to send the post.
 * 
 * @returns A 200 response with the fetched post.
 */
export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await prisma.post.findFirst({
    where: { id: Number(id) },
    include: { author: true, comments: true },
  });

  res.json(post);
};

/**
 * Updates a blog post by its ID.
 *
 * @param req - Express request object containing the post ID in the params and the updated title and content in the body.
 * @param res - Express response object used to send the updated post.
 * 
 * @returns A 200 response with the updated post.
 */
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { title, content },
  });

  res.json(post);
};

/**
 * Deletes a blog post by its ID.
 *
 * @param req - Express request object containing the post ID in the params.
 * @param res - Express response object used to confirm the deletion.
 * 
 * @returns A 200 response with a confirmation message.
 */
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.post.delete({ where: { id: Number(id) } });
  res.json({ message: 'Post deleted' });
};

/**
 * Toggles like/unlike on a blog post for the authenticated user.
 *
 * @param req - Express request object containing the post ID in the params.
 *              The user's ID is extracted from the authenticated user (req.user).
 * @param res - Express response object used to send the result of the like/unlike action.
 * 
 * @returns A 200 response indicating whether the post was liked or unliked, along with the updated like count.
 */
export const toggleLike = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  // Check if the user has already liked the post
  const existingLike = await prisma.like.findFirst({
    where: { postId: Number(id), userId },
  });

  if (existingLike) {
    // Unlike the post
    await prisma.like.delete({ where: { id: existingLike.id } });
    const likesCount = await prisma.like.count({ where: { postId: Number(id) } });
    return res.json({ message: 'Post unliked', likesCount, userLiked: false });
  } else {
    // Like the post
    await prisma.like.create({ data: { postId: Number(id), userId } });
    const likesCount = await prisma.like.count({ where: { postId: Number(id) } });
    return res.json({ message: 'Post liked', likesCount, userLiked: true });
  }
};

/**
 * Adds a comment to a blog post.
 *
 * @param req - Express request object containing the post ID in the params and the comment content in the body.
 *              The user's ID is extracted from the authenticated user (req.user).
 * @param res - Express response object used to send the created comment.
 * 
 * @returns A 201 response with the created comment.
 */
export const addComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user?.id;

  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId: Number(id),
      userId,
    },
    include: { user: true },
  });

  res.status(201).json({
    id: comment.id,
    content: comment.content,
    user: {
      email: comment.user.email,
      id: comment.user.id,
    },
  });
};

/**
 * Deletes a comment from a blog post.
 *
 * @param req - Express request object containing the post ID and comment ID in the params.
 *              The user's ID is extracted from the authenticated user (req.user).
 * @param res - Express response object used to confirm the deletion.
 * 
 * @returns A 200 response with a confirmation message.
 */
export const deleteComment = async (req: Request, res: Response) => {
  const { id, commentId } = req.params;
  const userId = req.user?.id;

  const comment = await prisma.comment.findFirst({
    where: { id: Number(commentId), postId: Number(id), userId },
  });

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found or unauthorized' });
  }

  await prisma.comment.delete({ where: { id: Number(commentId) } });
  res.json({ message: 'Comment deleted' });
};

/**
 * Fetches all comments for a specific blog post.
 *
 * @param req - Express request object containing the post ID in the params.
 * @param res - Express response object used to send the list of comments.
 * 
 * @returns A 200 response with an array of comments, including the author's email.
 */
export const getComments = async (req: Request, res: Response) => {
  const { id } = req.params;

  const comments = await prisma.comment.findMany({
    where: { postId: Number(id) },
    include: { user: true },
  });

  res.json(
    comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      authorEmail: comment.user.email,
    }))
  );
};
