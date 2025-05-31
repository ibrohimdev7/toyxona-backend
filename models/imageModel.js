const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    venue_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: [true, 'Venue is required'],
    },
    image_url: {
      type: String,
      required: [true, 'Image URL is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster querying
imageSchema.index({ venue_id: 1 });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;