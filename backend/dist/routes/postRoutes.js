"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticate, postController_1.createPost);
router.get('/', postController_1.getPosts);
router.get('/:id', postController_1.getPost);
router.put('/:id', authMiddleware_1.authenticate, postController_1.updatePost);
router.delete('/:id', authMiddleware_1.authenticate, postController_1.deletePost);
router.post('/:id/like', authMiddleware_1.authenticate, postController_1.toggleLike); // Toggle like/unlike
router.post('/:id/comments', authMiddleware_1.authenticate, postController_1.addComment); // Add a comment
router.delete('/:id/comments/:commentId', authMiddleware_1.authenticate, postController_1.deleteComment); // Delete a comment
router.get('/:id/comments', postController_1.getComments); // Get comments for a post
exports.default = router;
