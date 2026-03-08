const express = require('express');
const router = express.Router();
const {
  getBlogPosts,
  getBlogPost,
  getFeaturedPosts,
  getCategories,
  getTags,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getBlogPosts);
router.get('/featured', getFeaturedPosts);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/:slug', getBlogPost);

// Protected routes (require authentication)
router.post('/', protect, createBlogPost);
router.put('/:slug', protect, updateBlogPost);
router.delete('/:slug', protect, deleteBlogPost);

module.exports = router;
