const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  excerpt: String,
  thumbnail: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  courseType: { type: String, enum: ['free', 'paid'], default: 'free' },
  price: { type: Number, default: 0, min: 0 },
  accessType: { type: String, enum: ['open', 'enrollment'], default: 'enrollment' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  enrollmentCount: { type: Number, default: 0 },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all'], default: 'all' }
}, { timestamps: true, toJSON: { virtuals: true } });

courseSchema.virtual('modules', {
  ref: 'CourseModule',
  localField: '_id',
  foreignField: 'course'
});

courseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  next();
});

courseSchema.index({ slug: 1 });
courseSchema.index({ title: 'text', description: 'text' });

courseSchema.methods.incrementEnrollment = async function() {
  this.enrollmentCount += 1;
  await this.save();
};

courseSchema.statics.getFeatured = function() {
  return this.find({ isFeatured: true, isActive: true }).sort({ createdAt: -1 }).limit(6);
};

module.exports = mongoose.model('Course', courseSchema);
