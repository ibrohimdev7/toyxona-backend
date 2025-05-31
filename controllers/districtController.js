const District = require('../models/districtModel');
const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

// @desc    Get all districts
// @route   GET /api/districts
// @access  Public
exports.getDistricts = async (req, res, next) => {
  try {
    const districts = await District.find({});
    res.json({
      success: true,
      count: districts.length,
      data: districts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get district by ID
// @route   GET /api/districts/:id
// @access  Public
exports.getDistrictById = async (req, res, next) => {
  try {
    const district = await District.findById(req.params.id);

    if (!district) {
      return next(new AppError('District not found', 404));
    }

    res.json({
      success: true,
      data: district,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new district
// @route   POST /api/districts
// @access  Private/Admin
exports.createDistrict = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    // Check if district already exists
    const districtExists = await District.findOne({ name });
    if (districtExists) {
      return next(new AppError('District already exists', 400));
    }

    const district = await District.create({ name });

    res.status(201).json({
      success: true,
      data: district,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update district
// @route   PUT /api/districts/:id
// @access  Private/Admin
exports.updateDistrict = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    // Check if district with this name already exists
    const districtExists = await District.findOne({ 
      name, 
      _id: { $ne: req.params.id } 
    });
    
    if (districtExists) {
      return next(new AppError('District with this name already exists', 400));
    }

    const district = await District.findByIdAndUpdate(
      req.params.id,
      { name },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!district) {
      return next(new AppError('District not found', 404));
    }

    res.json({
      success: true,
      data: district,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete district
// @route   DELETE /api/districts/:id
// @access  Private/Admin
exports.deleteDistrict = async (req, res, next) => {
  try {
    const district = await District.findById(req.params.id);

    if (!district) {
      return next(new AppError('District not found', 404));
    }

    await district.deleteOne();

    res.json({
      success: true,
      message: 'District removed',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get venues in district
// @route   GET /api/districts/:id/venues
// @access  Public
exports.getDistrictVenues = async (req, res, next) => {
  try {
    const district = await District.findById(req.params.id);

    if (!district) {
      return next(new AppError('District not found', 404));
    }

    const venues = await district.populate({
      path: 'venues',
      match: { status: 'tasdiqlangan' },
      populate: { path: 'images' },
    });

    res.json({
      success: true,
      count: venues.venues.length,
      data: venues.venues,
    });
  } catch (error) {
    next(error);
  }
};