const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateImage } = require('../middleware/validationMiddleware');

/**
 * @swagger
 * /api/images:
 *   get:
 *     summary: Get all images (admin only)
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all images
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.get('/', protect, authorize('admin'), imageController.getImages);

/**
 * @swagger
 * /api/images/venue/{id}:
 *   get:
 *     summary: Get images for a specific venue
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of images for the venue
 *       404:
 *         description: Venue not found
 */
router.get('/venue/:id', imageController.getImagesByVenue);

/**
 * @swagger
 * /api/images/{id}:
 *   get:
 *     summary: Get image by ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image details
 *       404:
 *         description: Image not found
 */
router.get('/:id', imageController.getImageById);

/**
 * @swagger
 * /api/images:
 *   post:
 *     summary: Upload a new image
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - venue_id
 *               - image_url
 *             properties:
 *               venue_id:
 *                 type: string
 *               image_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Venue not found
 */
router.post('/', protect, validateImage, imageController.createImage);

/**
 * @swagger
 * /api/images/{id}:
 *   put:
 *     summary: Update image
 *     tags: [Images]
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
 *               - image_url
 *             properties:
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Image not found
 */
router.put('/:id', protect, imageController.updateImage);

/**
 * @swagger
 * /api/images/{id}:
 *   delete:
 *     summary: Delete image
 *     tags: [Images]
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
 *         description: Image deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Image not found
 */
router.delete('/:id', protect, imageController.deleteImage);

module.exports = router;