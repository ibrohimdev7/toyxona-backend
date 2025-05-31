const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    venue_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: [true, 'Venue is required'],
    },
    reservation_date: {
      type: Date,
      required: [true, 'Reservation date is required'],
    },
    guest_count: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'Guest count must be at least 1'],
    },
    client_phone: {
      type: String,
      required: [true, 'Client phone number is required'],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    status: {
      type: String,
      enum: ["bo'lib o'tgan", "endi bo'ladigan"],
      default: "endi bo'ladigan",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster querying
bookingSchema.index({ venue_id: 1, reservation_date: 1 }, { unique: true });
bookingSchema.index({ user_id: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;