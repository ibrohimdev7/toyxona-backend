const Booking = require('../models/bookingModel');
const Venue = require('../models/venueModel');
const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('venue_id', 'name address capacity price_seat')
      .populate('user_id', 'firstname lastname username');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('venue_id', 'name address capacity price_seat phone_number')
      .populate('user_id', 'firstname lastname username');

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check if the user is authorized to view this booking
    if (
      booking.user_id._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      // Check if the user is the owner of the venue
      const venue = await Venue.findById(booking.venue_id);
      if (!venue || venue.owner_id.toString() !== req.user.id) {
        return next(
          new AppError('Not authorized to view this booking', 403)
        );
      }
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { venue_id, reservation_date, guest_count, client_phone } = req.body;

    // Check if venue exists
    const venue = await Venue.findById(venue_id);
    if (!venue) {
      return next(new AppError('Venue not found', 404));
    }

    // Check if venue is approved
    if (venue.status !== 'tasdiqlangan') {
      return next(new AppError('Venue is not approved for bookings', 400));
    }

    // Check if guest count exceeds venue capacity
    if (guest_count > venue.capacity) {
      return next(
        new AppError(
          `Guest count exceeds venue capacity of ${venue.capacity}`,
          400
        )
      );
    }

    // Check if the venue is already booked for that date
    const existingBooking = await Booking.findOne({
      venue_id,
      reservation_date: new Date(reservation_date),
    });

    if (existingBooking) {
      return next(
        new AppError('Venue is already booked for this date', 400)
      );
    }

    // Create booking
    const booking = await Booking.create({
      venue_id,
      reservation_date,
      guest_count,
      client_phone,
      user_id: req.user.id,
      status: "endi bo'ladigan",
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check ownership
    if (booking.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new AppError('Not authorized to update this booking', 403)
      );
    }

    // If changing reservation date, check if the venue is available on that date
    if (req.body.reservation_date && req.body.reservation_date !== booking.reservation_date.toISOString()) {
      const existingBooking = await Booking.findOne({
        venue_id: booking.venue_id,
        reservation_date: new Date(req.body.reservation_date),
        _id: { $ne: booking._id },
      });

      if (existingBooking) {
        return next(
          new AppError('Venue is already booked for this date', 400)
        );
      }
    }

    // If changing guest count, check if it doesn't exceed venue capacity
    if (req.body.guest_count) {
      const venue = await Venue.findById(booking.venue_id);
      if (req.body.guest_count > venue.capacity) {
        return next(
          new AppError(
            `Guest count exceeds venue capacity of ${venue.capacity}`,
            400
          )
        );
      }
    }

    // Update the booking
    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('venue_id', 'name address capacity price_seat')
      .populate('user_id', 'firstname lastname username');

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check ownership or admin status
    if (
      booking.user_id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new AppError('Not authorized to delete this booking', 403)
      );
    }

    await booking.deleteOne();

    res.json({
      success: true,
      message: 'Booking removed',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user_id: req.user.id })
      .populate('venue_id', 'name address capacity price_seat')
      .sort({ reservation_date: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get venue bookings
// @route   GET /api/bookings/venue/:id
// @access  Private/Owner or Admin
exports.getVenueBookings = async (req, res, next) => {
  try {
    const venueId = req.params.id;
    
    // Check if venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return next(new AppError('Venue not found', 404));
    }

    // Check ownership or admin status
    if (
      venue.owner_id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new AppError('Not authorized to view bookings for this venue', 403)
      );
    }

    const bookings = await Booking.find({ venue_id: venueId })
      .populate('user_id', 'firstname lastname username')
      .sort({ reservation_date: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Owner or Admin
exports.changeBookingStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check if the user is an admin or the venue owner
    const venue = await Venue.findById(booking.venue_id);
    if (
      req.user.role !== 'admin' &&
      venue.owner_id.toString() !== req.user.id
    ) {
      return next(
        new AppError('Not authorized to change booking status', 403)
      );
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('venue_id', 'name address capacity price_seat')
      .populate('user_id', 'firstname lastname username');

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};