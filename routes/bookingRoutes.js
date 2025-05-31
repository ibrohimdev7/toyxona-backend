const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateBooking, validateBookingStatus } = require('../middleware/validationMiddleware');

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings (admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.get('/', protect, authorize('admin'), bookingController.getBookings);

/**
 * @swagger
 * /api/bookings/user:
 *   get:
 *     summary: Get bookings for the authenticated user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 *       401:
 *         description: Not authenticated
 */
router.get('/user', protect, bookingController.getUserBookings);

/**
 * @swagger
 * /api/bookings/venue/{id}:
 *   get:
 *     summary: Get bookings for a specific venue
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bookings for the venue
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Venue not found
 */
router.get('/venue/:id', protect, bookingController.getVenueBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 */
router.get('/:id', protect, bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - venue_id
 *               - reservation_date
 *               - guest_count
 *               - client_phone
 *             properties:
 *               venue_id:
 *                 type: string
 *               reservation_date:
 *                 type: string
 *                 format: date-time
 *               guest_count:
 *                 type: integer
 *                 minimum: 1
 *               client_phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Not authenticated
 */
router.post('/', protect, validateBooking, bookingController.createBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               reservation_date:
 *                 type: string
 *                 format: date-time
 *               guest_count:
 *                 type: integer
 *                 minimum: 1
 *               client_phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 */
router.put('/:id', protect, bookingController.updateBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 */
router.delete('/:id', protect, bookingController.deleteBooking);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Change booking status
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["bo'lib o'tgan", "endi bo'ladigan"]
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 */
router.put('/:id/status', protect, validateBookingStatus, bookingController.changeBookingStatus);

module.exports = router;