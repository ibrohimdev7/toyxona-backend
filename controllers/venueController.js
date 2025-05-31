const Venue = require("../models/venueModel");
const Image = require("../models/imageModel");
const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public
exports.getVenues = async (req, res, next) => {
  try {
    const { district, status, minCapacity, maxCapacity, minPrice, maxPrice } =
      req.query;

    // Build filter object
    const filter = {};
    if (district) filter.district_id = district;
    if (status) filter.status = status;
    if (minCapacity) filter.capacity = { $gte: Number(minCapacity) };
    if (maxCapacity) {
      filter.capacity = filter.capacity || {};
      filter.capacity.$lte = Number(maxCapacity);
    }
    if (minPrice) filter.price_seat = { $gte: Number(minPrice) };
    if (maxPrice) {
      filter.price_seat = filter.price_seat || {};
      filter.price_seat.$lte = Number(maxPrice);
    }

    const venues = await Venue.find(filter)
      .populate("district_id", "name")
      .populate("owner_id", "firstname lastname username")
      .populate("images");

    res.json({
      success: true,
      count: venues.length,
      data: venues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get venue by ID
// @route   GET /api/venues/:id
// @access  Public
exports.getVenueById = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id)
      .populate("district_id", "name")
      .populate("owner_id", "firstname lastname username")
      .populate("images")
      .populate({
        path: "bookings",
        select: "reservation_date guest_count status",
        match: { status: "endi bo'ladigan" },
      });

    if (!venue) {
      return next(new AppError("Venue not found", 404));
    }

    res.json({
      success: true,
      data: venue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new venue
// @route   POST /api/venues
// @access  Private/Owner
exports.createVenue = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Set owner to the current user
    req.body.owner_id = req.user.id;

    const venue = await Venue.create({ ...req.body, owner_id: req.user.id });

    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => ({
        venue_id: venue._id,
        path: file.filename, // or full path if needed
      }));
      await Image.insertMany(images);
    }

    res.status(201).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update venue
// @route   PUT /api/venues/:id
// @access  Private/Owner or Admin
exports.updateVenue = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let venue = await Venue.findById(req.params.id);

    if (!venue) {
      return next(new AppError("Venue not found", 404));
    }

    // Check ownership or admin status
    if (
      venue.owner_id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("Not authorized to update this venue", 403));
    }

    // Only admins can update status
    if (req.body.status && req.user.role !== "admin") {
      delete req.body.status;
    }

    // Update the venue
    venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("district_id", "name")
      .populate("owner_id", "firstname lastname username")
      .populate("images");

    res.json({
      success: true,
      data: venue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete venue
// @route   DELETE /api/venues/:id
// @access  Private/Owner or Admin
exports.deleteVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return next(new AppError("Venue not found", 404));
    }

    // Check ownership or admin status
    if (
      venue.owner_id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("Not authorized to delete this venue", 403));
    }

    // Delete associated images
    await Image.deleteMany({ venue_id: venue._id });

    // Delete the venue
    await venue.deleteOne();

    res.json({
      success: true,
      message: "Venue removed",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get venues by owner
// @route   GET /api/venues/owner
// @access  Private
exports.getVenuesByOwner = async (req, res, next) => {
  try {
    const venues = await Venue.find({ owner_id: req.user.id })
      .populate("district_id", "name")
      .populate("images");

    res.json({
      success: true,
      count: venues.length,
      data: venues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve venue (admin only)
// @route   PUT /api/venues/:id/approve
// @access  Private/Admin
exports.approveVenue = async (req, res, next) => {
  try {
    let venue = await Venue.findById(req.params.id);

    if (!venue) {
      return next(new AppError("Venue not found", 404));
    }

    venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { status: "tasdiqlangan" },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("district_id", "name")
      .populate("owner_id", "firstname lastname username")
      .populate("images");

    res.json({
      success: true,
      data: venue,
    });
  } catch (error) {
    next(error);
  }
};
