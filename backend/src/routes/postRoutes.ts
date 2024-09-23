import { Router } from 'express';
import {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  getComments,
} from '../controllers/postController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

router.post('/:id/like', authenticate, toggleLike); // Toggle like/unlike
router.post('/:id/comments', authenticate, addComment); // Add a comment
router.delete('/:id/comments/:commentId', authenticate, deleteComment); // Delete a comment
router.get('/:id/comments', getComments); // Get comments for a post

export default router;
