const { Category } = require('../models/CategoryTag');
const Course = require('../models/Course');

/**
 * GET /api/categories
 * Returns all categories from the CategoryTag model,
 * each enriched with a courseCount from the Course collection.
 */
const getCategories = async (req, res) => {
  try {
    // Aggregate course counts grouped by category _id
    const courseCounts = await Course.aggregate([
      { $match: { isActive: true, category: { $exists: true, $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Build a quick lookup map: categoryId -> count
    const countMap = {};
    for (const row of courseCounts) {
      countMap[row._id.toString()] = row.count;
    }

    const categories = await Category.find().sort({ name: 1 }).lean();

    const enriched = categories.map(cat => ({
      ...cat,
      courseCount: countMap[cat._id.toString()] || 0,
    }));

    res.json({ categories: enriched });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

module.exports = { getCategories };
