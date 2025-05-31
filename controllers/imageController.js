const Image = require('../models/imageModel');
const Venue = require('../models/venueModel');
const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

// @desc    Get all images
// @route   GET /api/images
// @access  Private/Admin
exports.getImages = async (req, res, next) => {
  try {
    const images = await Image.find({}).populate('venue_id', 'name');
    res.json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get image by ID
// @route   GET /api/images/:id
// @access  Public
exports.getImageById = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id).populate(
      'venue_id',
      'name'
    );

    if (!image) {
      return next(new AppError('Image not found', 404));
    }

    res.json({
      success: true,
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new image
// @route   POST /api/images
// @access  Private/Owner
exports.createImage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { venue_id, image_url } = req.body;

    // Check if venue exists
    const venue = await Venue.findById(venue_id);
    if (!venue) {
      return next(new AppError('Venue not found', 404));
    }

    // Check if user is the owner of the venue
    if (venue.owner_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new AppError('Not authorized to add images to this venue', 403)
      );
    }

    const image = await Image.create({
      venue_id,
      image_url,
    });

    res.status(201).json({
      success: true,
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update image
// @route   PUT /api/images/:id
// @access  Private/Owner or Admin
exports.updateImage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { image_url } = req.body;

    let image = await Image.findById(req.params.id);

    if (!image) {
      return next(new AppError('Image not found', 404));
    }

    // Check if user is the owner of the venue
    const venue = await Venue.findById(image.venue_id);
    if (venue.owner_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new AppError('Not authorized to update this image', 403)
      );
    }

    image = await Image.findByIdAndUpdate(
      req.params.id,
      { image_url },
      {
        new: true,
        runValidators: true,
      }
    ).populate('venue_id', 'name');

    res.json({
      success: true,
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete image
// @route   DELETE /api/images/:id
// @access  Private/Owner or Admin
exports.deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return next(new AppError('Image not found', 404));
    }

    // Check if user is the owner of the venue
    const venue = await Venue.findById(image.venue_id);
    if (venue.owner_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new AppError('Not authorized to delete this image', 403)
      );
    }

    await image.deleteOne();

    res.json({
      success: true,
      message: 'Image removed',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get images by venue
// @route   GET /api/images/venue/:id
// @access  Public
exports.getImagesByVenue = async (req, res, next) => {
  try {
    const venueId = req.params.id;
    
    // Check if venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return next(new AppError('Venue not found', 404));
    }

    const images = await Image.find({ venue_id: venueId });

    res.json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};