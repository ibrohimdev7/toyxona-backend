const { body } = require('express-validator');

// User validation rules
exports.validateUser = [
  body('firstname', 'First name is required').notEmpty(),
  body('lastname', 'Last name is required').notEmpty(),
  body('username', 'Username is required').notEmpty(),
  body('password', 'Password must be at least 6 characters').isLength({
    min: 6,
  }),
  body('role')
    .optional()
    .isIn(['admin', 'owner', 'user'])
    .withMessage('Role must be admin, owner, or user'),
];

// Authentication validation rules
exports.validateLogin = [
  body('username', 'Username is required').notEmpty(),
  body('password', 'Password is required').notEmpty(),
];

// Venue validation rules
exports.validateVenue = [
  body('name', 'Name is required').notEmpty(),
  body('district_id', 'District is required').notEmpty(),
  body('address', 'Address is required').notEmpty(),
  body('capacity', 'Capacity must be a positive number')
    .isInt({ min: 1 })
    .notEmpty(),
  body('price_seat', 'Price per seat must be a positive number')
    .isFloat({ min: 0 })
    .notEmpty(),
  body('phone_number', 'Phone number is required').notEmpty(),
  body('status')
    .optional()
    .isIn(['tasdiqlangan', 'tasdiqlanmagan'])
    .withMessage('Status must be tasdiqlangan or tasdiqlanmagan'),
];

// Booking validation rules
exports.validateBooking = [
  body('venue_id', 'Venue ID is required').notEmpty(),
  body('reservation_date', 'Reservation date is required')
    .notEmpty()
    .isISO8601()
    .withMessage('Reservation date must be a valid date'),
  body('guest_count', 'Guest count must be a positive number')
    .isInt({ min: 1 })
    .notEmpty(),
  body('client_phone', 'Client phone number is required').notEmpty(),
];

// District validation rules
exports.validateDistrict = [
  body('name', 'Name is required').notEmpty(),
];

// Image validation rules
exports.validateImage = [
  body('venue_id', 'Venue ID is required').notEmpty(),
  body('image_url', 'Image URL is required').notEmpty().isURL().withMessage('Must be a valid URL'),
];

// Booking status validation rules
exports.validateBookingStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(["bo'lib o'tgan", "endi bo'ladigan"])
    .withMessage("Status must be bo'lib o'tgan or endi bo'ladigan"),
];

// Profile update validation rules
exports.validateProfileUpdate = [
  body('firstname').optional(),
  body('lastname').optional(),
  body('username').optional(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];