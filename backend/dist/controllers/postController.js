"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComments = exports.deleteComment = exports.addComment = exports.toggleLike = exports.deletePost = exports.updatePost = exports.getPost = exports.getPosts = exports.createPost = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Creates a new blog post.
 *
 * @param req - Express request object containing the post's title and content in the body.
 *              The user's ID is extracted from the authenticated user (req.user).
 * @param res - Express response object used to send the created post.
 *
 * @returns A 201 response with the created post.
 */
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, content } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const post = yield prisma.post.create({
        data: { title, content, authorId: userId },
    });
    res.status(201).json(post);
});
exports.createPost = createPost;
/**
 * Fetches all blog posts, including their authors, comments, likes, and counts.
 *
 * @param req - Express request object. The user's ID is extracted from the authenticated user (req.user).
 * @param res - Express response object used to send the list of posts.
 *
 * @returns A 200 response with an array of posts, including information about authors, likes, comments, and whether the current user has liked each post.
 */
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const posts = yield prisma.post.findMany({
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
    const postsWithUserLiked = posts.map((post) => (Object.assign(Object.assign({}, post), { userLiked: post.likes.some((like) => like.user.id === userId) })));
    res.json(postsWithUserLiked);
});
exports.getPosts = getPosts;
/**
 * Fetches a single blog post by its ID.
 *
 * @param req - Express request object containing the post ID in the params.
 * @param res - Express response object used to send the post.
 *
 * @returns A 200 response with the fetched post.
 */
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield prisma.post.findFirst({
        where: { id: Number(id) },
        include: { author: true, comments: true },
    });
    res.json(post);
});
exports.getPost = getPost;
/**
 * Updates a blog post by its ID.
 *
 * @param req - Express request object containing the post ID in the params and the updated title and content in the body.
 * @param res - Express response object used to send the updated post.
 *
 * @returns A 200 response with the updated post.
 */
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, content } = req.body;
    const post = yield prisma.post.update({
        where: { id: Number(id) },
        data: { title, content },
    });
    res.json(post);
});
exports.updatePost = updatePost;
/**
 * Deletes a blog post by its ID.
 *
 * @param req - Express request object containing the post ID in the params.
 * @param res - Express response object used to confirm the deletion.
 *
 * @returns A 200 response with a confirmation message.
 */
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.post.delete({ where: { id: Number(id) } });
    res.json({ message: 'Post deleted' });
});
exports.deletePost = deletePost;
/**
 * Toggles like/unlike on a blog post for the authenticated user.
 *
 * @param req - Express request object containing the post ID in the params.
 *              The user's ID is extracted from the authenticated user (req.user).
 * @param res - Express response object used to send the result of the like/unlike action.
 *
 * @returns A 200 response indicating whether the post was liked or unliked, along with the updated like count.
 */
const toggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const post = yield prisma.post.findUnique({ where: { id: Number(id) } });
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    // Check if the user has already liked the post
    const existingLike = yield prisma.like.findFirst({
        where: { postId: Number(id), userId },
    });
    if (existingLike) {
        // Unlike the post
        yield prisma.like.delete({ where: { id: existingLike.id } });
        const likesCount = yield prisma.like.count({ where: { postId: Number(id) } });
        return res.json({ message: 'Post unliked', likesCount, userLiked: false });
    }
    else {
        // Like the post
        yield prisma.like.create({ data: { postId: Number(id), userId } });
        const likesCount = yield prisma.like.count({ where: { postId: Number(id) } });
        return res.json({ message: 'Post liked', likesCount, userLiked: true });
    }
});
exports.toggleLike = toggleLike;
/**
 * Adds a comment to a blog post.
 *
 * @param req - Express request object containing the post ID in the params and the comment content in the body.
 *              The user's ID is extracted from the authenticated user (req.user).
 * @param res - Express response object used to send the created comment.
 *
 * @returns A 201 response with the created comment.
 */
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { content } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const post = yield prisma.post.findUnique({ where: { id: Number(id) } });
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    const comment = yield prisma.comment.create({
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
});
exports.addComment = addComment;
/**
 * Deletes a comment from a blog post.
 *
 * @param req - Express request object containing the post ID and comment ID in the params.
 *              The user's ID is extracted from the authenticated user (req.user).
 * @param res - Express response object used to confirm the deletion.
 *
 * @returns A 200 response with a confirmation message.
 */
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, commentId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const comment = yield prisma.comment.findFirst({
        where: { id: Number(commentId), postId: Number(id), userId },
    });
    if (!comment) {
        return res.status(404).json({ error: 'Comment not found or unauthorized' });
    }
    yield prisma.comment.delete({ where: { id: Number(commentId) } });
    res.json({ message: 'Comment deleted' });
});
exports.deleteComment = deleteComment;
/**
 * Fetches all comments for a specific blog post.
 *
 * @param req - Express request object containing the post ID in the params.
 * @param res - Express response object used to send the list of comments.
 *
 * @returns A 200 response with an array of comments, including the author's email.
 */
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const comments = yield prisma.comment.findMany({
        where: { postId: Number(id) },
        include: { user: true },
    });
    res.json(comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        authorEmail: comment.user.email,
    })));
});
exports.getComments = getComments;
