const express = require("express");
const router = express.Router();
const venueController = require("../controllers/venueController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { validateVenue } = require("../middleware/validationMiddleware");

/**
 * @swagger
 * /api/venues:
 *   get:
 *     summary: Get all venues
 *     tags: [Venues]
 *     parameters:
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: minCapacity
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxCapacity
 *         schema:
 *           type: integer
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of venues
 */
router.get("/", venueController.getVenues);

/**
 * @swagger
 * /api/venues/owner:
 *   get:
 *     summary: Get venues by the authenticated owner
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of venues owned by the authenticated user
 *       401:
 *         description: Not authenticated
 */
router.get("/owner", protect, venueController.getVenuesByOwner);

/**
 * @swagger
 * /api/venues/{id}:
 *   get:
 *     summary: Get venue by ID
 *     tags: [Venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venue details
 *       404:
 *         description: Venue not found
 */
router.get("/:id", venueController.getVenueById);

/**
 * @swagger
 * /api/venues:
 *   post:
 *     summary: Create a new venue
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *               - district_id
 *               - address
 *               - capacity
 *               - price_seat
 *               - phone_number
 *             properties:
 *               name:
 *                 type: string
 *               district_id:
 *                 type: string
 *               address:
 *                 type: string
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *               price_seat:
 *                 type: number
 *                 minimum: 0
 *               phone_number:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [tasdiqlangan, tasdiqlanmagan]
 *     responses:
 *       201:
 *         description: Venue created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  validateVenue,
  venueController.createVenue
);

/**
 * @swagger
 * /api/venues/{id}:
 *   put:
 *     summary: Update venue
 *     tags: [Venues]
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
 *               name:
 *                 type: string
 *               district_id:
 *                 type: string
 *               address:
 *                 type: string
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *               price_seat:
 *                 type: number
 *                 minimum: 0
 *               phone_number:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [tasdiqlangan, tasdiqlanmagan]
 *     responses:
 *       200:
 *         description: Venue updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Venue not found
 */
router.put("/:id", protect, validateVenue, venueController.updateVenue);

/**
 * @swagger
 * /api/venues/{id}:
 *   delete:
 *     summary: Delete venue
 *     tags: [Venues]
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
 *         description: Venue deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Venue not found
 */
router.delete("/:id", protect, venueController.deleteVenue);

/**
 * @swagger
 * /api/venues/{id}/approve:
 *   put:
 *     summary: Approve a venue (admin only)
 *     tags: [Venues]
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
 *         description: Venue approved successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Venue not found
 */
router.put(
  "/:id/approve",
  protect,
  authorize("admin"),
  venueController.approveVenue
);

module.exports = router;
