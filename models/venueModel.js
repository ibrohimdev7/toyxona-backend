const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
    },
    district_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: [true, 'District is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    price_seat: {
      type: Number,
      required: [true, 'Price per seat is required'],
      min: [0, 'Price cannot be negative'],
    },
    phone_number: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    status: {
      type: String,
      enum: ['tasdiqlangan', 'tasdiqlanmagan'],
      default: 'tasdiqlanmagan',
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for images
venueSchema.virtual('images', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'venue_id',
});

// Virtual field for bookings
venueSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'venue_id',
});

// Create index for faster querying
venueSchema.index({ district_id: 1 });
venueSchema.index({ owner_id: 1 });
venueSchema.index({ status: 1 });

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;