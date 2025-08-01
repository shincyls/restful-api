const mongoose = require('mongoose');

const sellerReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, required: true },
}, { timestamps: true });

const SellerReview = mongoose.model('SellerReview', sellerReviewSchema);

module.exports = { SellerReview };
